import React from 'react'


//Component imports

//Header
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

import ENDPOINT from '../util/API';


const IcsPage = () => {
  document.title = app_name + " | Event Planner Heatmap"

  //Redux state
  const saved_entries = useSelector((state) => state.courseEntry.ics_dl_entries);
  const configName    = useSelector((state) => state.configSelect.selected_term);
  const dispatch = useDispatch();

  //Window Dimensions:
  const { height, width } = useWindowDimensions();
  const MOBILE_SWITCH = 1200;
  
  //Courses & CRN state

  const [addCourses, setAC] = React.useState([]);
  const [savedCourses, setSC] = React.useState([]);

  //Blob state
  const [blobURL,setBlobURL] = React.useState('');
  const [blobSize, setBlobSize] = React.useState('');

  const [errMsg, setErrMsg] = React.useState('');

  
  const getIndex = (sC , aC) => {
    return parseInt(sC.length + aC.length);
  }

  function RenderLink() {

    if(blobURL == 1){
        return (
        <>
          <br/>
          <div className="w_loader"></div>
          <p className="ics_dark">Our server(s) are currently processing your request ... </p>
          </>
        )
    }


    if(blobURL !== '' && isNaN(blobURL)){
      return (
        <>
          <br/>
          <p className="ics_dark"><b>Successfully created your .ics file </b></p>
          <br/>
          <a href={blobURL} className="ics_download_link" download="calendar.ics">CLICK TO DOWNLOAD ({blobSize} bytes)</a>
          <br/><br/>
          <button className="btn btn-primary ics_big_btn" onClick={() => {Sync_ICS_Post(setBlobURL, setBlobSize, setErrMsg, RenderLink )}}>
        Re-Generate My Calendar File
      </button>
        </>
      )
    } else {
      return (
        <>
        <br/>
        <button className="btn-primary btn-lg ics_big_btn" onClick={() => {Sync_ICS_Post(setBlobURL, setBlobSize, setErrMsg, RenderLink )}}>
        Generate My Calendar file 
      </button>
      </>
      )
    }
    
}

  
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
    <div className="mr-64 ml-64">
    

      <div className="">
              {/* <iframe allow="fullscreen;" width={iframeViewportScale(true, width)} height={iframeViewportScale(false, width)}
                src="https://www.youtube.com/embed/6FzGmNO8a0U?autoplay=1&mute=0">
              </iframe> */}
      </div>

      <div className="">
          <span className="step_title r_font">Step 1. Select a semester:</span> 
          {/* <p className="ics_p">* Select the <i>term/semester</i> you're generating this calendar file for, don't worry about <b>future terms</b> since we'll update this selection as time goes on.</p> */}
          <br/><br/>

          {/* Config Selection */}
          <div className="r_font">
              <TermSelect/>
          </div>

          <br/>
          <br/>
        <div className="step_title r_font">Step 2. Add your courses:</div>  
        
        {/* Entire Course Selection Widget */}
        
        <CourseEntry reduxKeyRef="ics_dl"/>

        <br/>

    {/* ADD COURSE BUTTON  */}

        <br/>
        <br/>
        <br/>
        <div className="r_font text-3xl font-bold">Step 3. Generate & Download:</div> 

        <span className="ics_err_msg">  {errMsg} </span>
        
        {RenderLink()}<br/><br/>

      
      </div>

      </div>
    </div>
  );
}

export default IcsPage