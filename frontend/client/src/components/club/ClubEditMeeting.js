import React from 'react'

import '../../static/css/popup.css'
import MeetingComponent from './MeetingComponent'
import PopUpPadding from '../util/PopUpPadding'

//Redux stuff
import { useSelector, useDispatch } from 'react-redux'
import { edit_entry, reset} from '../../redux/features/meetingEditSlice'

const ClubEditMeeting = ({trigger, setTrigger, body}) => {
  // props.trigger -> Trigger boolean
  // props.body -> Existing Meeting events 

  const meetStore = useSelector((state) => state.meetingEdit.meeting_entries);
  const dispatch = useDispatch();

  //States:
  
  //Meeting Display state:
  const [meetings, SetMeetings] = React.useState([]);

  //Receiving submissions from <MeetingComponent/>
  
  const receiveSub = (type, index, content) => {

    //Spread redux meetingEdit.meeting_entries state into mutable obj (to be modified)
    let meetRaw = [...meetStore]

    if(type === 1 && typeof(meetRaw[index]) === 'undefined' ){ //Create New Meeting

      meetRaw.push(content);

    } else if (type === 1 && typeof(meetRaw[index]) === 'object'){ //Edit Existing Meeting
      
      // meetRaw[index] = content;

    } 
    else if(type === 0){ //Delete

      meetRaw.splice(index, 1);
    }

    //Redux reset
    dispatch(
      reset({
        new_state : meetRaw
      })
    );


  }

  const addMeeting = () => {
    let meetRef = [...meetings];

    //Add component:
    meetRef.push(<MeetingComponent key={ meetRef.length } 
                index={meetRef.length} 
                passBack={receiveSub} 
                />);

    SetMeetings(meetRef);
  }

  const populatedSavedMeetings = (store) => {

    let meetInit = []

    for(const meeting of store){
      meetInit.push(<MeetingComponent key={ meetInit.length } 
        index={meetInit.length} 
        passBack={receiveSub} 
        savedPayload={meeting}
        />);
    }

    SetMeetings(meetInit);
  }

  //Close pop up fun for popup padding
  const closePopUp = () => {
    setTrigger(false);
  }


  // Use effect for when PopUp is toggled

  React.useEffect(
    () => {
      SetMeetings([]);
      populatedSavedMeetings(meetStore);
    }  , [trigger]
  )



  return (
    (trigger) ? (
      <div className="popup_bg">
        <PopUpPadding executeClose={ closePopUp }/>
        <div className="popup_inner">
        <button className="btn btn-close" onClick={() => {closePopUp();}}/>
            {body}
            <div className="info_title">Add Meeting Events :</div> <br/>

            {meetings}

            <button className="btn btn-success" onClick={ 
              () => {addMeeting()}
            }>Add a meeting</button>
        </div>
      </div> ) : ''
  )
}

export default ClubEditMeeting