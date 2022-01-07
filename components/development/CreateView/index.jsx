/***************************************
 * Title: index
 * Description: visualisation for creating view announcements
 * Author: Wout Slabbinck (wout.slabbinck@ugent.be)
 * Created on 06/01/2022
 *****************************************/

import {
  Button,
  Card,
  CardActions,
  CardContent, CardHeader,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle, TextField,
  Typography
} from "@material-ui/core";
import { TREE, DCT, LDES, XSD, AS } from "@treecg/ldes-orchestrator";
import { postAnnouncement } from "@treecg/ldes-announcements";
import { useRef, useState } from "react";

const announcement = {
  "@context": { "@vocab": AS.namespace },
  "@id": `#announce`,
  "@type": [AS.Announce],
  actor: { "@id": "https://github.com/woutslabbinck" },
  object: { "@id": "temp" }
};

function createViewAnnouncement(config) {
  const bucketizerConfig = {
    "@type": [LDES.BucketizerConfiguration],
    "@context": { "@vocab": LDES.namespace, path: TREE.path },
    pageSize: { "@value": config.pageSize, "@type": XSD.positiveInteger },
    path: { "@id": config.propertyPath },
    bucketizer: { "@id": config.bucketizer },
    "@id": `#bucketizerConfig`
  };
  const reverse = {
    "@context": { "@vocab": TREE.namespace },
    view: { "@id": config.originalLDES }
  };
  const view = {
    "@id": "#view",
    "@type": TREE.Node,
    "@context": { "@vocab": TREE.namespace, "ldes": LDES.namespace, "dct": DCT.namespace },
    "dct:isVersionOf": { "@id": config.versionOf },
    "dct:issued": { "@value": new Date().toISOString(), "@type": XSD.dateTime },
    "ldes:configuration": bucketizerConfig,
    "@reverse": reverse
  };

  const viewAnnouncement = { ...announcement };
  viewAnnouncement.object = view;
  return viewAnnouncement;
}

function CreateViewAnnouncementCard(props) {
  const [open, setOpen] = useState(false);

  const [versionOf, setVersionOf] = useState("https://test/output/root.ttl");
  const [originalLDES, setOriginalLDES] = useState("https://smartdata.dev-vlaanderen.be/base/gemeente");
  const [bucketizer, setBucketizer] = useState("https://w3id.org/ldes#SubstringBucketizer");
  const [propertyPath, setPropertyPath] = useState("http://www.w3.org/2000/01/rdf-schema#label");
  const [pageSize, setPageSize] = useState(100);

  const versionOfRef = useRef(null);
  const originalLDESRef = useRef(null);
  const bucketizerRef = useRef(null);
  const propertyPathRef = useRef(null);
  const pageSizeRef = useRef(null);

  const values = [{ "label": "Location of created view", "value": versionOf, "ref": versionOfRef },
    { "label": "Original LDES", "value": originalLDES, "ref": originalLDESRef },
    { "label": "ype of bucketizer", "value": bucketizer, "ref": bucketizerRef },
    { "label": "Property path of bucketizer", "value": propertyPath, "ref": propertyPathRef },
    { "label": "Number of elements in one page of the bucketizer", "value": pageSize, "ref": pageSizeRef }]
  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleUpdate() {
    setVersionOf(versionOfRef.current.value)
    setOriginalLDES(originalLDESRef.current.value)
    setBucketizer(bucketizerRef.current.value)
    setPropertyPath(propertyPathRef.current.value)
    setPageSize(pageSizeRef.current.value)
    setOpen(false);
  }

  return (
    <div>
      <Card>
        <CardHeader title={"Create View Announcement"}/>
        <CardContent>
          {values.map(({label, value}) => (
            <Typography key={label+"__view"}>{label}: {value}</Typography>
          ))}
        </CardContent>
        <CardActions>
          <Button onClick={handleOpen}>Edit</Button>
          <Button onClick={async () => {
            const announcement = createViewAnnouncement({ versionOf, originalLDES, bucketizer, propertyPath, pageSize });
            const response = await postAnnouncement(announcement, props.ldesIRI);
          }}>Create View</Button>
        </CardActions>
      </Card>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          <h1>Edit</h1>
        </DialogTitle>
        <DialogContent>
          {values.map(({label, value,ref}) => (
            <TextField label={label}
                       inputRef={ref}
                       defaultValue={value}
                       key={label}
                       fullWidth
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate}>Done</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>

  );
}

export default CreateViewAnnouncementCard;
