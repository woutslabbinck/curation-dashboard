/***************************************
 * Title: index
 * Description: visualisation for creating view announcements
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

function CreateViewAnnouncementCard(props) {
  const versionOf = "https://test/output/root.ttl";
  const originalLDES = "https://smartdata.dev-vlaanderen.be/base/gemeente";
  const bucketizer = "https://w3id.org/ldes#SubstringBucketizer";
  const propertyPath = "http://www.w3.org/2000/01/rdf-schema#label";
  const pageSize = 100;

  const bucketizerConfig = {
    "@type": [LDES.BucketizerConfiguration],
    "@context": { "@vocab": LDES.namespace, path: TREE.path },
    pageSize: { "@value": pageSize, "@type": XSD.positiveInteger },
    path: { "@id": propertyPath },
    bucketizer: { "@id": bucketizer },
    "@id": `#bucketizerConfig`
  };
  const reverse = {
    "@context": { "@vocab": TREE.namespace },
    view: { "@id": originalLDES }
  };
  const view = {
    "@id": "#view",
    "@type": TREE.Node,
    "@context": { "@vocab": TREE.namespace, "ldes": LDES.namespace, "dct": DCT.namespace },
    "dct:isVersionOf": { "@id": versionOf },
    "dct:issued": { "@value": new Date().toISOString(), "@type": XSD.dateTime },
    "ldes:configuration": bucketizerConfig,
    "@reverse": reverse
  };

  const viewAnnouncement = { ...announcement };
  viewAnnouncement.object = view;


  return (
    <Card>
      <Button onClick={async () => {
        const response = await postAnnouncement(viewAnnouncement, props.ldesIRI);
      }}>Create View</Button>
    </Card>
  );
}

export  default CreateViewAnnouncementCard;
