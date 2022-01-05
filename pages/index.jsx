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
import { TextField, Card, CardContent, Typography, Button as MaterialButton, CardActions } from "@material-ui/core";
import { fetchResourceAsStore } from "@treecg/curation/dist/src/util/SolidCommunication";
import { extractAnnouncementsMetadata } from "@treecg/ldes-announcements";


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
  return (<Card>
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
        <MaterialButton variant="contained" onClick={async () => {
          // NOTE: Should also update the list of members -> remove the announcement
          await props.curator.accept(props.member.iri, props.member.value, props.member.timestamp.getTime());
        }}>Accept</MaterialButton>
        <MaterialButton variant="contained" onClick={async () => {
          await props.curator.reject(props.member.iri, props.member.timestamp.getTime());
        }}>Reject</MaterialButton>
      </CardActions>
    </Card>
  );
}

function AnnouncementCardList(props) {
  const cards = props.members.map(member => (
    <AnnouncementCard member={member} curator={props.curator} id={member.iri} key={member.iri}/>
  ));
  return (
    <div>
      {cards}
    </div>
  )
}

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

  // temporary state for visualisation
  const [member, setMember] = useState({});
  const [members, setMembers] = useState([]);
  // console.log(props);
  return (
    <div>
      <h1>Demo</h1>
      {/* {session.info.isLoggedIn && <Profile />} */}
      {session.info.isLoggedIn && (
        <div>
          <Button onClick={async () => {
            const [ldesInit, curatorInit] = await initialise(session, ldesIRI, curatedIRI, syncedIRI);
            setLdes(ldesInit);
            setCurator(curatorInit);

            // fetch members
            const members = (await curatorInit.getRecentMembers(100))
            const test = []
            for (const {memberIRI, timestamp} of members){
              let member = await curatorInit.extractMember(memberIRI)

              // TODO: This should happen probably in the curator package
              const announcementStore = await fetchResourceAsStore(memberIRI, session);
              const metadata = await extractAnnouncementsMetadata(announcementStore);
              const announcementMetadata = metadata.announcements.get(memberIRI + "#announce");

              test.push({...member, announcement: announcementMetadata, timestamp: new Date(timestamp)})
            }
            setMember(test[0]);
            setMembers(test)
            setInitialised(true);
          }}>Init</Button><br />
          {initialised && (
            <AnnouncementCardList members={members} curator={curator}/>
          )}
        </div>
      )}
      <div>
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
      </div>

    </div>
  );
}
