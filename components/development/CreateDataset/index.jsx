/***************************************
 * Title: index
 * Description: visualisation for creating dataset view announcements
 * Author: Wout Slabbinck (wout.slabbinck@ugent.be)
 * Created on 06/01/2022
 *****************************************/

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle, TextField,
  Typography
} from "@material-ui/core";
import { TREE, DCT, LDES, XSD, AS } from "@treecg/ldes-orchestrator";
import { postAnnouncement } from "@treecg/ldes-announcements";
import { DCAT } from "@treecg/ldes-announcements/dist/util/Vocabularies";
import { useRef, useState } from "react";

const announcement = {
  "@context": { "@vocab": AS.namespace },
  "@id": `#announce`,
  "@type": [AS.Announce],
  actor: { "@id": "https://github.com/woutslabbinck" },
  object: { "@id": "temp" }
};


function createDatasetAnnouncement({ creator, description, identifier, license, title, shape, view }) {
  const dataset = {
    "@id": "#dataset",
    "@type": [DCAT.Dataset],
    "@context": { "tree": TREE.namespace, "dct": DCT.namespace },
    "dct:creator": { "@id": creator },
    "dct:description": description,
    "dct:identifier": identifier,
    "dct:issued": { "@value": new Date().toISOString(), "@type": XSD.dateTime },
    "dct:license": { "@id": license },
    "dct:title": title,
    "tree:shape": { "@id": shape },
    "tree:view": { "@id": view }
  };
  const datasetAnnouncement = { ...announcement };
  datasetAnnouncement.object = dataset;
  return datasetAnnouncement;
}

function CreateDatasetAnnouncementCard(props) {
  const [open, setOpen] = useState(false);

  const [creator, setCreator] = useState("https://data.knows.idlab.ugent.be/person/woslabbi/#me");
  const [description, setDescription] = useState("Description of the current dataset.");
  const [identifier, setIdentifier] = useState("dataset-uuid");
  const [license, setLicense] = useState("https://creativecommons.org/licenses/by/4.0/");
  const [title, setTitle] = useState("Dataset");
  const [shape, setShape] = useState("https://example.org/shape.ttl");
  const [view, setView] = useState("https://example.org/#view");

  const creatorRef = useRef(null);
  const descriptionRef = useRef(null);
  const identifierRef = useRef(null);
  const licenseRef = useRef(null);
  const titleRef = useRef(null);
  const shapeRef = useRef(null);
  const viewRef = useRef(null);

  const values = [{ "label": "Creator of the Dataset", "value": creator, "ref": creatorRef },
    { "label": "Title", "value": description, "ref": descriptionRef },
    { "label": "Description", "value": identifier, "ref": identifierRef },
    { "label": "Identifier", "value": license, "ref": licenseRef },
    { "label": "License", "value": title, "ref": titleRef },
    { "label": "Shape", "value": shape, "ref": shapeRef },
    { "label": "View", "value": view, "ref": viewRef }];

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleUpdate() {
    setCreator(creatorRef.current.value);
    setDescription(descriptionRef.current.value);
    setIdentifier(identifierRef.current.value);
    setLicense(licenseRef.current.value);
    setTitle(titleRef.current.value);
    setShape(shapeRef.current.value);
    setView(viewRef.current.value);
    setOpen(false);
  }


  return (
    <div>
      <Card>
        <CardHeader title={"Create Dataset Announcement"} />
        <CardContent>
          {values.map(({label, value}) => (
            <Typography key={label+"__dataset"}>{label}: {value}</Typography>
          ))}
        </CardContent>
        <CardActions>
          <Button onClick={handleOpen}>Edit</Button>
          <Button onClick={async () => {
            const datasetAnnouncement = createDatasetAnnouncement({ creator, description, identifier, license, title, shape, view });
            console.log(datasetAnnouncement);
            const response = await postAnnouncement(datasetAnnouncement, props.ldesIRI);
          }}>Create Dataset</Button>
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
                       key={label+"__dataset-dialog"}
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

export default CreateDatasetAnnouncementCard;
