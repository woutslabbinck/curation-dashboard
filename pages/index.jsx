/**
 * Copyright 2021 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { useSession } from "@inrupt/solid-ui-react";
import { Button } from "@inrupt/prism-react-components";
import { LDESinSolid, Orchestrator } from "@treecg/ldes-orchestrator";
import { Curator } from "@treecg/curation";
import { useState } from "react";
import {
  TextField,
  Card,
  CardContent,
  Typography,
  Button as MaterialButton,
  CardActions,
  Grid, Tabs, Tab
} from "@material-ui/core";
import { TREE, DCAT } from "@treecg/curation/dist/src/util/Vocabularies";
import * as PropTypes from "prop-types";

async function initialise(session, ldesIRI, curatedIRI, syncedIRI) {
  const ldesConfig = await LDESinSolid.getConfig(ldesIRI, session); //Note: Might not always have those permissions of the ldes ->
  const ldes = new LDESinSolid(
    ldesConfig.ldesConfig,
    ldesConfig.aclConfig,
    session
  );
  const config = {
    ldesIRI: ldesIRI,
    curatedIRI: curatedIRI,
    synchronizedIRI: syncedIRI
  };
  const curator = new Curator(config, session);
  await curator.init(false);// NOTE: For debugging it is easier to have a public curated set
  await curator.synchronize();
  return [ldes, curator];
}

function AnnouncementCard(props) {
  // Todo only do this for cardcontent
  switch (props.member.type) {
    case TREE.Node:
      return (
        <Grid item>
          <Card>
            <CardContent>
              <Typography> View Announcement</Typography>
              <br />
              <Typography> Creator: {props.member.announcement.actor["@id"]} </Typography>
              <Typography> Announcement issued at certain
                date: {(new Intl.DateTimeFormat("nl", { weekday: "short" }).format(props.member.timestamp))} {props.member.timestamp.toLocaleString()}</Typography>
              <Typography> Original LDES: {props.member.value["dct:isVersionOf"]["@id"]} </Typography>
              <Typography> Original Collection: {props.member.value["@reverse"].view["@id"]} </Typography>
            </CardContent>
            <CardActions>
              <MaterialButton variant="contained"
                              onClick={async () => props.accept(props.member)}>Accept</MaterialButton>
              <MaterialButton variant="contained"
                              onClick={async () => props.reject(props.member)}>Reject</MaterialButton>
            </CardActions>
          </Card>
        </Grid>
      );
    case DCAT.DataService:
      return (
        <Grid item>
          <Card>
            <CardContent>
              <Typography> DCAT DataService Announcement</Typography>
              <br />
              <Typography> Creator: {props.member.announcement.actor["@id"]} </Typography>
              <Typography> Announcement issued at certain
                date: {(new Intl.DateTimeFormat("nl", { weekday: "short" }).format(props.member.timestamp))} {props.member.timestamp.toLocaleString()}</Typography>
              <Typography> Creator of the dataservice: {props.member.value["dct:creator"]["@id"]}</Typography>
              <Typography> Title of the dataservice: {props.member.value["dct:title"]["@value"]}</Typography>
              <Typography> Description of the
                dataservice: {props.member.value["dct:description"]["@value"]}</Typography>
              <Typography> Endpoint of the dataservice: {props.member.value["dcat:endpointURL"]["@id"]}</Typography>
              <Typography> Dataservice serves: {props.member.value["dcat:servesDataset"]["@id"]}</Typography>

            </CardContent>
            <CardActions>
              <MaterialButton variant="contained"
                              onClick={async () => props.accept(props.member)}>Accept</MaterialButton>
              <MaterialButton variant="contained"
                              onClick={async () => props.reject(props.member)}>Reject</MaterialButton>
            </CardActions>
          </Card>
        </Grid>
      );
    case DCAT.Dataset:
      return (
        <Grid item>
          <Card>
            <CardContent>
              <Typography> DCAT Dataset Announcement</Typography>
              <br />
              <Typography> Creator: {props.member.announcement.actor["@id"]} </Typography>
              <Typography> Announcement issued at certain
                date: {(new Intl.DateTimeFormat("nl", { weekday: "short" }).format(props.member.timestamp))} {props.member.timestamp.toLocaleString()}</Typography>
              <Typography> Creator of the dataset: {props.member.value["dct:creator"]["@id"]}</Typography>
              <Typography> Title of the dataset: {props.member.value["dct:title"]["@value"]}</Typography>
              <Typography> Description of the dataset: {props.member.value["dct:description"]["@value"]}</Typography>
            </CardContent>
            <CardActions>
              <MaterialButton variant="contained"
                              onClick={async () => props.accept(props.member)}>Accept</MaterialButton>
              <MaterialButton variant="contained"
                              onClick={async () => props.reject(props.member)}>Reject</MaterialButton>
            </CardActions>
          </Card>
        </Grid>
      );
    default:
      console.log(`Cannot visualise this type of announcement, I don't know the type`);
      return (
        <Card>
          <Typography>This announcement can not be visualised: {props.member.iri}</Typography>
        </Card>
      );
  }

}

function AnnouncementCardList(props) {
  /**
   * Removes a member from the list that is visualised
   */
  function removeMembers(member) {
    const visualisedMembers = [...props.members];
    const index = visualisedMembers.indexOf(member);
    visualisedMembers.splice(index, 1);
    props.setMembers(visualisedMembers);
  }

  async function acceptMember(member) {
    removeMembers(member);
    await props.curator.accept(member.iri, member.value, member.timestamp.getTime());
  }

  async function rejectMember(member) {
    removeMembers(member);
    await props.curator.reject(member.iri, member.timestamp.getTime());
  }

  const cards = props.members.map(member => (
    <AnnouncementCard member={member} curator={props.curator} id={member.iri} key={member.iri} accept={acceptMember}
                      reject={rejectMember} />
  ));

  return (
    <Grid
      spacing={1}
      container
      direction="row"
      alignItems="center"
      // justify="center"
    >
      {cards}
    </Grid>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} aria-labelledby={index} role="tabpanel">
      {children}
    </div>);
}

TabPanel.propTypes = {
  index: PropTypes.string,
  value: PropTypes.string
};
export default function Home() {
  const { session } = useSession();
  const base = "http://localhost:3050/";
  const [solidPod, setSolidPod] = useState(base);
  const [ldesIRI, setLdesIRI] = useState(base + "new/");
  const [curatedIRI, setCuratedIRI] = useState(base + "curated/"); // note: both curated and synced could always be based on pod but manual control can be given
  const [syncedIRI, setSynchronizedIRI] = useState(base + "synced/");
  const [ldes, setLdes] = useState({});
  const [curator, setCurator] = useState({});
  const [initialised, setInitialised] = useState(false);

  // list of announcements to be visualised
  const [announcements, setAnnouncements] = useState([]);

  // state of the tabs
  const [value, setValue] = useState("configuration");

  const handleChange = async (event, newValue) => {
    setValue(newValue);

    // set state of curated LDES and/or initialisation parameter
    switch (newValue) {
      case "configuration":
        setInitialised(false);
        setAnnouncements([]);
        break;
      case "announcements":
        if (!initialised) {
          const curator =await init();
          await fetchAnnouncements(curator);
        } else {
          await fetchAnnouncements(curator);
        }
        break;
      case "curated":
        if (!initialised) {
          await init();
        }
        break;
    }
  };

  const init = async () => {
    const [ldesInit, curatorInit] = await initialise(session, ldesIRI, curatedIRI, syncedIRI);
    setLdes(ldesInit);
    setCurator(curatorInit);
    setInitialised(true);
    return curatorInit
  };

  async function fetchAnnouncements(curator) {
    // fetch members
    const members = (await curator.getRecentMembers(100));
    const announcements = [];
    for (const { memberIRI, timestamp } of members) {
      let member = await curator.extractMember(memberIRI);
      announcements.push({ ...member, timestamp: new Date(timestamp) });
    }
    setAnnouncements(announcements);
  }

  return (
    <div>
      {session.info.isLoggedIn && (
        <div>
          <Tabs value={value} onChange={handleChange}
                aria-label="basic tabs example">
            <Tab label="Configuration" value="configuration" />
            <Tab label="Announcements" value="announcements" />
            <Tab label="Curated LDES" value="curated" />
          </Tabs>
          <TabPanel value={value} index="configuration">
            <br />
            <TextField
              fullWidth
              label={"Solid Pod"}
              value={solidPod}
              onChange={(e) => setSolidPod(e.target.value)}>
            </TextField><br />
            <TextField
              fullWidth
              label={"LDES URL"}
              value={ldesIRI}
              onChange={(e) => setLdesIRI(e.target.value)}>
            </TextField><br />
            <TextField
              fullWidth
              label={"Synchronized URL"}
              value={syncedIRI}
              onChange={(e) => setSynchronizedIRI(e.target.value)}>
            </TextField><br />
            <TextField
              fullWidth
              label={"Curated URL"}
              value={curatedIRI}
              onChange={(e) => setCuratedIRI(e.target.value)}>
            </TextField>
            <Button onClick={async () => await init()}>Init</Button>
          </TabPanel>
          <TabPanel value={value} index="announcements">
            <h1>Announcements</h1>
            <AnnouncementCardList members={announcements} curator={curator} setMembers={setAnnouncements} />
          </TabPanel>
          <TabPanel value={value} index="curated">
            <h1>Curated Catalog</h1>
            <p>View <a href={curatedIRI} target="_blank">{curatedIRI}</a></p>
          </TabPanel>
        </div>
      )}
    </div>
  );
}
