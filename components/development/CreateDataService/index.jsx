/***************************************
 * Title: index
 * Description: visualisation for creating  view announcements
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

function createDataServiceAnnouncement({
                                         creator,
                                         description,
                                         conforms,
                                         title,
                                         contactPoint,
                                         endpoint,
                                         servesDataset
                                       }) {
  const dataservice = {
    "@id": "#dataservice",
    "@type": [DCAT.DataService],
    "@context": { "dcat": DCAT.namespace, "dct": DCT.namespace },
    "dct:creator": { "@id": creator },
    "dct:description": description,
    "dct:conformsTo": { "@id": conforms },
    "dct:title": title,
    "dcat:contactPoint": { "@id": contactPoint },
    "dcat:endpointURL": { "@id": endpoint },
    "dcat:servesDataset": { "@id": servesDataset }
  };
  const dataServiceAnnouncement = { ...announcement };
  dataServiceAnnouncement.object = dataservice;
  return dataServiceAnnouncement;
}

function CreateDataServiceAnnouncementCard(props) {
  const [open, setOpen] = useState(false);

  const [creator, setCreator] = useState("https://data.knows.idlab.ugent.be/person/woslabbi/#me");
  const [description, setDescription] = useState("Description of the current DataService.");
  const [title, setTitle] = useState("DataService");
  const [conforms, setConforms] = useState("https://w3id.org/ldes/specification");
  const [endpoint, setEndpoint] = useState("https://hostname/distribution");
  const [servesDataset, setServesDataset] = useState("https://smartdata.dev-vlaanderen.be/base/gemeente");
  const [contactPoint, setContactPoint] = useState("https://example.org/woslabbi/#vcard");

  const creatorRef = useRef(null);
  const descriptionRef = useRef(null);
  const titleRef = useRef(null);
  const conformsRef = useRef(null);
  const endpointRef = useRef(null);
  const servesDatasetRef = useRef(null);
  const contactPointRef = useRef(null);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleUpdate() {
    setCreator(creatorRef.current.value);
    setTitle(titleRef.current.value);
    setDescription(descriptionRef.current.value);
    setConforms(conformsRef.current.value);
    setEndpoint(endpointRef.current.value);
    setServesDataset(servesDatasetRef.current.value);
    setContactPoint(contactPointRef.current.value);
    setOpen(false);
  }

  const values = [{ "label": "Creator of the DataService", "value": creator, "ref": creatorRef },
    { "label": "Title", "value": title, "ref": titleRef },
    { "label": "Description", "value": description, "ref": descriptionRef },
    { "label": "Conforms to the following specification", "value": conforms, "ref": conformsRef },
    { "label": "Endpoint URL", "value": endpoint, "ref": endpointRef },
    { "label": "Servers dataset", "value": servesDataset, "ref": servesDatasetRef },
    { "label": "Contact point", "value": contactPoint, "ref": contactPointRef }];

  return (
    <div>
      <Card>
        <CardHeader title={"Create DataService Announcement"} />
        <CardContent>
          {values.map(({ label, value }) => (
            <Typography key={label + "__dataservice"}>{label}: {value}</Typography>
          ))}
        </CardContent>
        <CardActions>
          <Button onClick={handleOpen}>Edit</Button>
          <Button onClick={async () => {
            const datasetAnnouncement = createDataServiceAnnouncement({
              creator,
              description,
              conforms,
              title,
              contactPoint,
              endpoint,
              servesDataset
            });
            const response = await postAnnouncement(datasetAnnouncement, props.ldesIRI);
          }}>Create DataService</Button>
        </CardActions>
      </Card>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          <h1>Edit</h1>
        </DialogTitle>
        <DialogContent>
          {values.map(({ label, value, ref }) => (
            <TextField label={label}
                       inputRef={ref}
                       defaultValue={value}
                       key={label + "__dataservice-dialog"}
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

export default CreateDataServiceAnnouncementCard;
