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
import { LDESinSolid } from "@treecg/ldes-orchestrator";
import { Curator } from "@treecg/curation";
import { useState } from "react";
import {
  TextField,
  Tabs,
  Tab,
  Fab,
  Tooltip,
  Backdrop,
  CircularProgress,
  Switch,
  FormControlLabel, Divider, Grid
} from "@material-ui/core";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import Settings from "@material-ui/icons/Settings";
import * as PropTypes from "prop-types";
import AnnouncementCardList from "../components/announcements/announcements";
import CreateViewAnnouncementCard from "../components/development/CreateView";
import CreateDatasetAnnouncementCard from "../components/development/CreateDataset";
import CreateDataServiceAnnouncementCard from "../components/development/CreateDataService";
import CreateInboxCard from "../components/development/inbox";

async function initialise(session, ldesIRI, curatedIRI, syncedIRI) {
  const config = {
    ldesIRI: ldesIRI,
    curatedIRI: curatedIRI,
    synchronizedIRI: syncedIRI
  };
  const curator = new Curator(config, session);
  await curator.init(false);// NOTE: For debugging it is easier to have a public curated set
  await curator.synchronize();
  return curator;
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
  // const [solidPod, setSolidPod] = useState(base);
  const [ldesIRI, setLdesIRI] = useState(base + "announcements/");
  const [curatedIRI, setCuratedIRI] = useState(base + "curated/"); // note: both curated and synced could always be based on pod but manual control can be given
  const [syncedIRI, setSynchronizedIRI] = useState(base + "synced/");

  const [curator, setCurator] = useState({});
  const [initialised, setInitialised] = useState(false);
  const [announcementsFetched, setAnnouncementsFetched] = useState(false); // used for loading icon when the announcements are being fetched using the synced LDES

  // list of announcements to be visualised
  const [announcements, setAnnouncements] = useState([]);

  // state of the tabs
  const [value, setValue] = useState("configuration");

  // development mode
  const [devMode, setDevMode] = useState(false);

  /**
   * Logic for switching the tabs
   * @param event
   * @param newValue
   * @returns {Promise<void>}
   */
  const handleChange = async (event, newValue) => {
    setValue(newValue);

    // set state of curated LDES and/or initialisation parameter
    switch (newValue) {
      case "configuration":
        setInitialised(false);
        setAnnouncements([]);
        setAnnouncementsFetched(false);
        break;
      case "announcements":
        if (!initialised) {
          const curator = await init();
          await fetchAnnouncements(curator);
        } else {
          if (announcements.length === 0) {
            await fetchAnnouncements(curator);
          }
        }
        break;
      case "curated":
        if (!initialised) {
          await init();
        }
        break;
      default:
        break;
    }
  };

  /**
   * initialise the curator and store it in the state
   * @returns {Promise<Curator>}
   */
  const init = async () => {
    const curatorInit = await initialise(session, ldesIRI, curatedIRI, syncedIRI);
    setCurator(curatorInit);
    setInitialised(true);
    return curatorInit;
  };

  /**
   * Fetch all the announcements and store it in the state
   * @param curator
   * @returns {Promise<void>}
   */
  async function fetchAnnouncements(curator) {
    // fetch members
    const members = (await curator.getRecentMembers(100));
    const announcements = [];
    for (const { memberIRI, timestamp } of members) {
      let member = await curator.extractMember(memberIRI);
      announcements.push({ ...member, timestamp: new Date(timestamp) });
    }
    setAnnouncements(announcements);
    setAnnouncementsFetched(true);
  }

  return (
    <div>
      {session.info.isLoggedIn && (
        <div>
          <Tabs value={value} onChange={handleChange}
                aria-label="basic tabs example"
          >
            <Tab icon={<Settings />} value="configuration" />
            <Tab label="Announcements" value="announcements" />
            <Tab label="Curated LDES" value="curated" />
            {devMode && (<Tab label="Development" value="dev" />)}
          </Tabs>
          <TabPanel value={value} index="configuration">
            {/*<TextField*/}
            {/*  fullWidth*/}
            {/*  label={"Solid Pod"}*/}
            {/*  value={solidPod}*/}
            {/*  onChange={(e) => setSolidPod(e.target.value)}>*/}
            {/*</TextField>*/}
            <TextField
              fullWidth
              label={"Announcement LDES URL"}
              value={ldesIRI}
              onChange={(e) => setLdesIRI(e.target.value)}>
            </TextField>
            <TextField
              fullWidth
              label={"Synchronized URL"}
              value={syncedIRI}
              onChange={(e) => setSynchronizedIRI(e.target.value)}>
            </TextField>
            <TextField
              fullWidth
              label={"Curated LDES URL"}
              value={curatedIRI}
              onChange={(e) => setCuratedIRI(e.target.value)}>
            </TextField>
            <Grid container>
              <Button onClick={async () => await init()}>Init</Button>
              <Divider orientation={"vertical"} variant={"middle"} flexItem />
              <FormControlLabel
                control={<Switch color="primary" checked={devMode} onChange={(e, checked) => setDevMode(checked)} />}
                label={"Dev"} />
            </Grid>

          </TabPanel>
          <TabPanel value={value} index="announcements">
            <h1>
              Announcements {" "}
              <Tooltip title="Synchronize with the announcement LDES and visualise them" arrow>
                <Fab
                  size="medium"
                  color="primary"
                  onClick={async () => {
                    setAnnouncementsFetched(false);
                    await curator.synchronize();
                    await fetchAnnouncements(curator);
                  }}>
                  <AutorenewIcon />
                </Fab>
              </Tooltip>

            </h1>
            <Backdrop open={!announcementsFetched}>
              <CircularProgress />
            </Backdrop>
            {announcementsFetched &&
              <AnnouncementCardList members={announcements} curator={curator} setMembers={setAnnouncements}
                                    devMode={devMode} />}
          </TabPanel>
          <TabPanel value={value} index="curated">
            <h1>Curated Catalog</h1>
            <p>View <a href={curatedIRI} target="_blank">{curatedIRI}</a></p>
          </TabPanel>
          <TabPanel value={value} index="dev">
            <h1>Development</h1>
            <CreateViewAnnouncementCard ldesIRI={ldesIRI} />
            <CreateDatasetAnnouncementCard ldesIRI={ldesIRI} />
            <CreateDataServiceAnnouncementCard ldesIRI={ldesIRI} />
            <CreateInboxCard ldesIRI={ldesIRI} session={session} />
          </TabPanel>
        </div>
      )}
    </div>
  );
}
