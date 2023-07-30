import React from 'react';
import Cookies from "universal-cookie";

//Component imports

import PageHeader from '../components/navbar/PageHeader';
import TermSelect from '../components/util/TermSelect';
import CourseEntry from '../components/course_entry/CourseEntry';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { assertPush, assertDelete } from '../redux/features/courseEntrySlice';

//Local 
import { app_name } from '../util/constant';
import { Sync_ICS_Post , OAuth_Redirect} from '../util/requests';
import '../static/css/main_ui.css';

//Hooks
import useWindowDimensions from '../util/hooks/useWindowDimensions';
import SchoolRouteRenderWall from '../components/schools/SchoolRouteRenderWall';

const googleSvg = <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 text-gray-900 dark:text-white`} viewBox="0 0 48 48"><path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/></svg>

const IcsPage = () => {

  document.title = app_name + " | .ICS Export";

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

  // ICS Helper FNS:

  const getSelectedCDIs = () => {
    let course_data_ids_list = [];

    for(const entry of saved_entries) {
      course_data_ids_list.push(entry.course_data_id);
    }
    return course_data_ids_list;
  }



  //Google Calendar Auth stuff
  const handleGoogleCalendar = () => {

    let course_data_ids_list = getSelectedCDIs();
    const cookies = new Cookies();

    //! TO BE USED IN PRODUCTION:
    //cookies.set('course_data_ids', JSON.stringify(course_data_ids_list), { domain: '.ezcampus.org', path: '/' });
    console.log(JSON.stringify(course_data_ids_list));

    cookies.set('course_data_ids', JSON.stringify(course_data_ids_list), { path: '/' });
    OAuth_Redirect();
  }


  const handleSubmitICS = () => {

    //Assert for possibility of Empty Submission Request
    if(saved_entries.length < 1){
      setErrMsg("There is nothing to generate... add some courses");
      return;
    } 

    let course_data_ids_list = getSelectedCDIs();

    //Preform Request; Passing over callbacks to ICS page's State Setters
    Sync_ICS_Post(setBlobURL, setBlobSize, setErrMsg, RenderLink, course_data_ids_list )

  }

  function RenderLink() {

    if(blobURL === 1){
        return (
        <>
          <br/>
          <p className="sub_title">Our server(s) are currently processing your request ... </p>
          </>
        )
    }


    if(blobURL !== '' && isNaN(blobURL)){
      return (
        <>
          <br/>
          <p className="sub_title">Successfully created your .ics file!</p>
          <br/>
      <a className="large_blue_btn" href={blobURL} download="calendar.ics"> Download `calendar.ics` | ({blobSize} bytes)</a>
          <br/><br/>
      
      <button className="large_warning_btn" onClick={() => {handleSubmitICS()}}>
      Re-Generate My Calendar File
      </button>
        </>);
    } else {

      if(saved_entries.length) {

      return (<><br/>
        <button className="large_blue_btn" onClick={() => {handleSubmitICS()}}>
          Generate My Calendar file 
        </button>

        <br/><br/>

        <button className="large_red_btn flex items-center justify-center space-x-2" onClick={() => {handleGoogleCalendar()}}>
          {googleSvg}
          Export to Google Calendar
        </button>
      </>);
      } 
      
      else {
        return (<><br/>
        <button className="large_blue_btn disabled">
          Select courses first...
        </button>
      </>);
      }

    }
    
}

  return (

    <SchoolRouteRenderWall page={
    <div>
    <PageHeader/>
    <br/><br/>
    <div className="mr-4 ml-4 md:mr-32 md:ml-32 lg:mr-56 lg:ml-56">

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

      </div>

      </div>
    </div>} />
  );
}

export default IcsPage