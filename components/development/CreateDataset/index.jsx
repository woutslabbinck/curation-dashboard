/***************************************
 * Title: index
 * Description: visualisation for creating dataset view announcements
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


function CreateDatasetAnnouncementCard(props) {
  const creator = "https://data.knows.idlab.ugent.be/person/woslabbi/#me";
  const description = "Description of the current dataset.";
  const identifier = "dataset-uuid";
  const license = "https://creativecommons.org/licenses/by/4.0/";
  const title = "Dataset";
  const shape = "https://example.org/shape.ttl";
  const view = "https://example.org/#view";
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

  return (
    <Card>
      <Button onClick={async () => {
        const response = await postAnnouncement(datasetAnnouncement, props.ldesIRI);
      }}>Create Dataset</Button>
    </Card>
  );
}

export default CreateDatasetAnnouncementCard;
