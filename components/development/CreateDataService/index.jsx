/***************************************
 * Title: index
 * Description: visualisation for creating  view announcements
 * Author: Wout Slabbinck (wout.slabbinck@ugent.be)
 * Created on 06/01/2022
 *****************************************/

import { Button, Card } from "@material-ui/core";
import { TREE, DCT, LDES, XSD, AS } from "@treecg/ldes-orchestrator";
import { postAnnouncement } from "@treecg/ldes-announcements";
import { DCAT } from "@treecg/ldes-announcements/dist/util/Vocabularies";

const announcement = {
  "@context": { "@vocab": AS.namespace },
  "@id": `#announce`,
  "@type": [AS.Announce],
  actor: { "@id": "https://github.com/woutslabbinck" },
  object: { "@id": "temp" }
};

function CreateDataServiceAnnouncementCard(props) {
  const creator = "https://data.knows.idlab.ugent.be/person/woslabbi/#me";
  const description = "Description of the current DataService.";
  const title = "DataService";
  const conforms = "https://w3id.org/ldes/specification"
  const endpoint = "https://hostname/distribution"
  const servesDataset = "https://smartdata.dev-vlaanderen.be/base/gemeente"
  const contactPoint = "https://example.org/woslabbi/#vcard"

  const dataservice = {
    "@id": "#dataservice",
    "@type": [DCAT.DataService],
    "@context": { "dcat": DCAT.namespace, "dct": DCT.namespace },
    "dct:creator": { "@id": creator },
    "dct:description": description,
    "dct:conformsTo": { "@id": conforms},
    "dct:title": title,
    "dcat:contactPoint": { "@id": contactPoint},
    "dcat:endpointURL": { "@id": endpoint},
    "dcat:servesDataset": { "@id": servesDataset},
  };
  const dataServiceAnnouncement = { ...announcement };
  dataServiceAnnouncement.object = dataservice;

  return (
    <Card>
      <Button onClick={async () => {
        const response = await postAnnouncement(dataServiceAnnouncement, props.ldesIRI);
        console.log(response);
      }}>Create DataService</Button>
    </Card>
  );
}

export default CreateDataServiceAnnouncementCard;
