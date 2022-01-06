import { DCAT, TREE } from "@treecg/curation/dist/src/util/Vocabularies";
import { Button as MaterialButton, Card, CardActions, CardContent, Grid, Typography } from "@material-ui/core";

function AnnouncementCard(props) {
  // Todo only do this for cardcontent
  switch (props.member.type) {
    case TREE.Node:
      return (
        <Grid item>
          <Card>
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
              <MaterialButton variant="contained"
                              onClick={async () => props.accept(props.member)}>Accept</MaterialButton>
              <MaterialButton variant="contained"
                              onClick={async () => props.reject(props.member)}>Reject</MaterialButton>
            </CardActions>
          </Card>
        </Grid>
      );
    case DCAT.DataService:
      return (
        <Grid item>
          <Card>
            <CardContent>
              <Typography> DCAT DataService Announcement</Typography>
              <br />
              <Typography> Creator: {props.member.announcement.actor["@id"]} </Typography>
              <Typography> Announcement issued at certain
                date: {(new Intl.DateTimeFormat("nl", { weekday: "short" }).format(props.member.timestamp))} {props.member.timestamp.toLocaleString()}</Typography>
              <Typography> Creator of the dataservice: {props.member.value["dct:creator"]["@id"]}</Typography>
              <Typography> Title of the dataservice: {props.member.value["dct:title"]["@value"]}</Typography>
              <Typography> Description of the
                dataservice: {props.member.value["dct:description"]["@value"]}</Typography>
              <Typography> Endpoint of the dataservice: {props.member.value["dcat:endpointURL"]["@id"]}</Typography>
              <Typography> Dataservice serves: {props.member.value["dcat:servesDataset"]["@id"]}</Typography>

            </CardContent>
            <CardActions>
              <MaterialButton variant="contained"
                              onClick={async () => props.accept(props.member)}>Accept</MaterialButton>
              <MaterialButton variant="contained"
                              onClick={async () => props.reject(props.member)}>Reject</MaterialButton>
            </CardActions>
          </Card>
        </Grid>
      );
    case DCAT.Dataset:
      return (
        <Grid item>
          <Card>
            <CardContent>
              <Typography> DCAT Dataset Announcement</Typography>
              <br />
              <Typography> Creator: {props.member.announcement.actor["@id"]} </Typography>
              <Typography> Announcement issued at certain
                date: {(new Intl.DateTimeFormat("nl", { weekday: "short" }).format(props.member.timestamp))} {props.member.timestamp.toLocaleString()}</Typography>
              <Typography> Creator of the dataset: {props.member.value["dct:creator"]["@id"]}</Typography>
              <Typography> Title of the dataset: {props.member.value["dct:title"]["@value"]}</Typography>
              <Typography> Description of the dataset: {props.member.value["dct:description"]["@value"]}</Typography>
            </CardContent>
            <CardActions>
              <MaterialButton variant="contained"
                              onClick={async () => props.accept(props.member)}>Accept</MaterialButton>
              <MaterialButton variant="contained"
                              onClick={async () => props.reject(props.member)}>Reject</MaterialButton>
            </CardActions>
          </Card>
        </Grid>
      );
    default:
      console.log(`Cannot visualise this type of announcement, I don't know the type`);
      return (
        <Card>
          <Typography>This announcement can not be visualised: {props.member.iri}</Typography>
        </Card>
      );
  }
}

export default AnnouncementCard;
