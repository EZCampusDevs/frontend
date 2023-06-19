import React from 'react'


//Component imports

import PageHeader from '../components/navbar/PageHeader';
import TermSelect from '../components/util/TermSelect';
import CourseEntry from '../components/course_entry/CourseEntry';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { assertPush, assertDelete } from '../redux/features/courseEntrySlice';

//Local 
import { app_name } from '../util/constant';
import { Sync_ICS_Post } from '../util/requests';
import '../static/css/main_ui.css';

//Hooks
import useWindowDimensions from '../util/hooks/useWindowDimensions';


const IcsPage = () => {

//Google Calendar Auth stuff
  var gapi = window.gapi;
  console.log(gapi)
  var CLIENT_ID = "712384750559-gfvgd0eukbv859v4768so8dobj949kf8.apps.googleusercontent.com";
  var G_API_KEY = "AIzaSyDvkDQ5say67ia8t9ejwpmTddxFN9-w7qA";
  var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  var SCOPES = "https://www.googleapis.com/auth/calendar.events";

  const handleGoogleCalendar = () => {
    gapi.load('client:auth2', () => {
      console.log('loaded client')

      gapi.client.init({
        apiKey: G_API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      gapi.client.load('calendar', 'v3', () => console.log('bam!'))

      gapi.auth2.getAuthInstance().signIn() //! Errors I think
      .then(() => {

        console.log("Gets here?")
        
        var event = {
          'summary': 'Awesome Event!',
          'location': '800 Howard St., San Francisco, CA 94103',
          'description': 'Really great refreshments',
          'start': {
            'dateTime': '2023-06-28T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': '2023-06-28T17:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
          },
          'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
          ],
          'attendees': [
            {'email': 'lpage@example.com'},
            {'email': 'sbrin@example.com'}
          ],
          'reminders': {
            'useDefault': false,
            'overrides': [
              {'method': 'email', 'minutes': 24 * 60},
              {'method': 'popup', 'minutes': 10}
            ]
          }
        }

        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event,
        })

        console.log("Inserted?")

        request.execute(event => {
          console.log(event)
          window.open(event.htmlLink)
        })
        

        /*
            Uncomment the following block to get events
        */
        /*
        // get events
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(response => {
          const events = response.result.items
          console.log('EVENTS: ', events)
        })
        */
    

      })
    })
  }

  document.title = app_name + " | Calendar"

  //Redux state
  const saved_entries = useSelector((state) => state.courseEntry.ics_dl_entries);
  const configName    = useSelector((state) => state.configSelect.selected_term);
  const dispatch = useDispatch();

  //Window Dimensions:
  const { height, width } = useWindowDimensions();
  const MOBILE_SWITCH = 1200;
  
  //Blob state
  const [blobURL,setBlobURL] = React.useState('');
  const [blobSize, setBlobSize] = React.useState('');

  const [errMsg, setErrMsg] = React.useState('');


  const handleSubmitICS = () => {

    //Assert for possibility of Empty Submission Request
    if(saved_entries.length < 1){
      setErrMsg("There is nothing to generate... add some courses");
      return;
    } 

    let course_data_ids_list = [];

    for(const entry of saved_entries) {
      course_data_ids_list.push(entry.course_data_id);
    }

    //Preform Request; Passing over callbacks to ICS page's State Setters
    Sync_ICS_Post(setBlobURL, setBlobSize, setErrMsg, RenderLink, course_data_ids_list )

  }

  function RenderLink() {

    if(blobURL === 1){
        return (
        <>
          <br/>
          <p>Our server(s) are currently processing your request ... </p>
          </>
        )
    }


    if(blobURL !== '' && isNaN(blobURL)){
      return (
        <>
          <br/>
          <p>Successfully created your .ics file </p>
          <br/>
          <a className="large-blue-btn" href={blobURL} download="calendar.ics">CLICK TO DOWNLOAD ({blobSize} bytes)</a>
          <br/><br/>
          <button className="" onClick={() => {handleSubmitICS()}}>
        Re-Generate My Calendar File
      </button>
        </>);
    } else {

      if(saved_entries.length) {

      return (<><br/>
        <button className="large_blue_btn" onClick={() => {handleSubmitICS()}}>
          Generate My Calendar file 
        </button>
      </>);
      } else {
        return (<><br/>
        <button className="large_blue_btn disabled" onClick={() => {handleSubmitICS()}}>
          Select courses first...
        </button>
      </>);
      }

    }
    
}

  //

  React.useEffect( () => {
  }, [saved_entries])


//! Might be removed if we remove the video embd
  //Based on the Width of the viewport, this function will return a fair height/width to match the size of viewport.
  const iframeViewportScale = (axis, width) => {
    if(axis) { //If width
      return MOBILE_SWITCH > width ? "200" : "430";
    } 
    if(!axis) { //If Height
      return MOBILE_SWITCH > width ? "150" : "315";
    }
  }

  return (
    <div>
    <PageHeader/>
    <br/><br/>
    <div className="mr-4 ml-4 sm:mr-64 sm:ml-64">

    {/* //! Might be removed if we remove the video embd */}
      <div className="">
              {/* <iframe allow="fullscreen;" width={iframeViewportScale(true, width)} height={iframeViewportScale(false, width)}
                src="https://www.youtube.com/embed/6FzGmNO8a0U?autoplay=1&mute=0">
              </iframe> */}
      </div>

      <div className="">
          <span className="step_title r_font">Step 1. Select a semester:</span> 
          <br/><br/>

          {/* Config Selection */}
          <div className="r_font">
              <TermSelect/>
          </div>

          <br/><br/>
        <div className="step_title r_font">Step 2. Add your courses:</div>  
        
        {/* Entire Course Selection Widget */}
        <br/>
        <CourseEntry reduxReference="ics_dl"/>

        <br/>

        <br/>
        <div className="step_title r_font">Step 3. Generate & Download:</div> 

        <span className="error_text r_font"> {errMsg} </span>
        
        {RenderLink()}<br/><br/>

        {/* <button className="large_blue_btn disabled" onClick={() => {handleGoogleCalendar()}}>Save to Google Calendar (Coming Soon)</button> */}

      </div>

      </div>
    </div>
  );
}

export default IcsPage