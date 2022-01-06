import AnnouncementCard from "../announcementCard";
import { Grid } from "@material-ui/core";

/***************************************
 * Title: index
 * Description: visualisation of a collection of announcements
 * Author: Wout Slabbinck (wout.slabbinck@ugent.be)
 * Created on 06/01/2022
 *****************************************/

function AnnouncementCardList(props) {
  /**
   * Removes a member from the list that is visualised
   */
  function removeMembers(member) {
    const visualisedMembers = [...props.members];
    const index = visualisedMembers.indexOf(member);
    visualisedMembers.splice(index, 1);
    props.setMembers(visualisedMembers);
  }

  async function acceptMember(member) {
    removeMembers(member);
    await props.curator.accept(member.iri, member.value, member.timestamp.getTime());
  }

  async function rejectMember(member) {
    removeMembers(member);
    await props.curator.reject(member.iri, member.timestamp.getTime());
  }

  const cards = props.members.map(member => (
    <AnnouncementCard member={member} curator={props.curator} id={member.iri} key={member.iri} accept={acceptMember}
                      reject={rejectMember} />
  ));

  return (
    <Grid
      spacing={1}
      container
      direction="row"
      alignItems="center"
    >
      {cards}
    </Grid>
  );
}

export default AnnouncementCardList;
