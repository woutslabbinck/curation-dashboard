import { DCAT, TREE } from "@treecg/curation/dist/src/util/Vocabularies";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid, Tooltip,
  Typography
} from "@material-ui/core";

function AnnouncementCard(props) {
  let cardContent;
  switch (props.member.type) {
    case TREE.Node:
      cardContent = (<CardContent>
        <h2> View Announcement</h2>
        <Typography> Creator: {props.member.announcement.actor["@id"]} </Typography>
        <Typography> Announcement issued at certain
          date: {(new Intl.DateTimeFormat("nl", { weekday: "short" }).format(props.member.timestamp))} {props.member.timestamp.toLocaleString()}</Typography>
        <Typography> Original LDES: {props.member.value["dct:isVersionOf"]["@id"]} </Typography>
        <Typography> Original Collection: {props.member.value["@reverse"].view["@id"]} </Typography>
      </CardContent>);
      break;
    case DCAT.DataService:
      cardContent = (
        <CardContent>
          <h2> DCAT DataService Announcement</h2>
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
      );
      break;
    case DCAT.Dataset:
      cardContent = (
        <CardContent>
          <h2> DCAT Dataset Announcement</h2>
          <Typography> Creator: {props.member.announcement.actor["@id"]} </Typography>
          <Typography> Announcement issued at certain
            date: {(new Intl.DateTimeFormat("nl", { weekday: "short" }).format(props.member.timestamp))} {props.member.timestamp.toLocaleString()}</Typography>
          <Typography> Creator of the dataset: {props.member.value["dct:creator"]["@id"]}</Typography>
          <Typography> Title of the dataset: {props.member.value["dct:title"]["@value"]}</Typography>
          <Typography> Description of the dataset: {props.member.value["dct:description"]["@value"]}</Typography>
        </CardContent>
      );
      break;
    default:
      console.log(`Cannot visualise this type of announcement, I don't know the type`);
      return (
        <Card>
          <Typography>This announcement can not be visualised: {props.member.iri}</Typography>
        </Card>
      );
  }
  return (
    <Grid item>
      <Card>
        {cardContent}
        <CardActions>
          <Button variant="contained"
                          onClick={async () => props.accept(props.member)}>Accept</Button>
          <Button variant="contained"
                          onClick={async () => props.reject(props.member)}>Reject</Button>
          <Tooltip title={"View the original announcement"}>
            <Button onClick={() => window.open(props.member.iri, "_blank")}>Original {/* NOTE: this only good for development!!*/}</Button>
          </Tooltip>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default AnnouncementCard;
