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
import Profile from "../components/profile";
import { useState } from "react";

async function createLDES(session) {
  const solidServer = "http://localhost:3050/";
  const ldesConfig = {
    base: `${solidServer}new/`,
    treePath: "http://purl.org/dc/terms/modified",
    shape: `${solidServer}shape`,
    relationType: "https://w3id.org/tree#GreaterThanOrEqualToRelation",
  };
  const aclConfig = {
    agent: "https://pod.inrupt.com/woutslabbinck/profile/card#me",
  };
  const ldes = new LDESinSolid(ldesConfig, aclConfig, session);
  await ldes.createLDESinLDP();
}

async function orchestrate(session) {
  const base = "http://localhost:3050/new/";
  const ldesconfig = await LDESinSolid.getConfig(base, session);
  const ldes = new LDESinSolid(
    ldesconfig.ldesConfig,
    ldesconfig.aclConfig,
    session,
    2
  );
  const orchestrator = new Orchestrator(session);
  await orchestrator.orchestrateLDES(ldes, 10);
}
async function curate(session) {
    const rootIRI = "http://localhost:3050/new/";
  const curatedIRI = "http://localhost:3050/curated/";
  const synchronizedIRI = "http://localhost:3050/synced/";
  const config = {
    ldesIRI: rootIRI,
    curatedIRI,
    synchronizedIRI,
  };
  const curator = new Curator(config, session);
  await curator.init();
  await curator.synchronize();
  const members = (await curator.getRecentMembers(100)).map(
    (member) => member.memberIRI
  );
  console.log(members[0]);
}

export default function Home() {
  const { session } = useSession();
  const [solidPod, setSolidPod] = useState("");
  // console.log(props);
  return (
    <div>
      <h1>Demo</h1>
      {/* {session.info.isLoggedIn && <Profile />} */}
      {session.info.isLoggedIn && (
        <div>
          <Button onClick={async () => createLDES(session)}>
            Create LDES at http://localhost:3050/
          </Button>
          <Button onClick={async () => orchestrate(session)}>
            Orchestrate this ldes
            {/* -> does not really work due to caching in browser Note: it does not make sense anyway to orchestrate in browser */}
          </Button>
          <br />

        <Button onClick={async () => curate(session)}>Curate </Button>
        </div>
      )}
      <div>
          <br/>
          <Button onClick={() => setSolidPod('http://localhost:3050/')}>Set Solid Pod</Button>
          <p>Solid Pod used: {solidPod}</p>
      </div>

    </div>
  );
}
