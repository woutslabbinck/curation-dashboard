import { useSession } from "@inrupt/solid-ui-react";
import { useState } from "react";
import { Button, Card, Typography } from "@material-ui/core";
import { LDESinSolid } from "@treecg/ldes-orchestrator";

/***************************************
 * Title: index.jsx
 * Description: Creating an LDES in LDP used for announcement inbox
 * Author: Wout Slabbinck (wout.slabbinck@ugent.be)
 * Created on 06/01/2022
 *****************************************/
function CreateInboxCard(props) {
  const { session, ldesIRI, ...other } = props;
  const shape = "http://localhost:3050/shape";
  const treePath = "http://purl.org/dc/terms/modified";
  const relationType = "https://w3id.org/tree#GreaterThanOrEqualToRelation";
  return (
    <Card>
      <h2> Create new LDES in LDP</h2>
      <Typography>Location: {ldesIRI}</Typography>
      <Typography>Owner: {session.info.webId}</Typography>
      <Typography>Shape: <a href={shape}>{shape}</a></Typography>
      <Typography>Tree path: {treePath}</Typography>
      <Typography>Relation type: {relationType}</Typography>
      <Button onClick={async () => {
        const ldesConfig = {
          base: ldesIRI,
          treePath: treePath,
          shape: shape,
          relationType: relationType
        };
        const aclConfig = {
          agent: session.info.webId
        };
        const ldes = new LDESinSolid(ldesConfig, aclConfig, session);
        await ldes.createLDESinLDP();
      }}>Create LDES in LDP</Button>
    </Card>
  );
}

export default CreateInboxCard;
