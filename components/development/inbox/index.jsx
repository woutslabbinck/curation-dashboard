import {
  Button,
  Card, CardActions, CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@material-ui/core";
import { LDESinSolid } from "@treecg/ldes-orchestrator";
import { useRef, useState } from "react";


function CardActionsArea() {
  return null;
}

/***************************************
 * Title: index.jsx
 * Description: Creating an LDES in LDP used for announcement inbox
 * Author: Wout Slabbinck (wout.slabbinck@ugent.be)
 * Created on 06/01/2022
 *****************************************/
function CreateInboxCard(props) {
  const { session, ldesIRI, ...other } = props;
  const [open, setOpen] = useState(false);
  const [shape, setShape] = useState("http://localhost:3050/shape");
  const [treePath, setTreePath] = useState("http://purl.org/dc/terms/modified");
  const [relationType, setRelationType] = useState("https://w3id.org/tree#GreaterThanOrEqualToRelation");

  const shapeRef = useRef(null);
  const treePathRef = useRef(null);
  const relationTypeRef = useRef(null);


  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleUpdate() {
    setShape(shapeRef.current.value);
    setTreePath(treePathRef.current.value);
    setRelationType(relationTypeRef.current.value);
    setOpen(false);
  }

  return (
    <div>
      <Card>
        <CardContent>
          <h2>Create new LDES in LDP</h2>
          <Typography>Location: {ldesIRI}</Typography>
          <Typography>Owner: {session.info.webId}</Typography>
          <Typography>Shape: <a href={shape}>{shape}</a></Typography>
          <Typography>Tree path: {treePath}</Typography>
          <Typography>Relation type: {relationType}</Typography>
        </CardContent>
          <CardActions>
            <Button onClick={handleOpen}>Edit</Button>
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
          </CardActions>


      </Card>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          <h1>Edit</h1>
        </DialogTitle>
        <DialogContent>
          <TextField label="Shape"
                     inputRef={shapeRef}
                     defaultValue={shape}
                     fullWidth />
          <TextField label="Tree path (SHACL path)"
                     inputRef={treePathRef}
                     defaultValue={treePath}
                     fullWidth />
          <TextField label="Relation Type"
                     inputRef={relationTypeRef}
                     defaultValue={relationType}
                     fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate}>Done</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateInboxCard;
