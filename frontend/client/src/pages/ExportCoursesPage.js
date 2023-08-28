import React from 'react';
import Cookies from "universal-cookie";

//Component imports
import PageHeader from '../components/navbar/PageHeader';
import TermSelect from '../components/util/TermSelect';
import CourseEntry from '../components/course_entry/CourseEntry';

import Footer from '../components/footer/Footer';

//Redux
import {useSelector, useDispatch} from 'react-redux';
import {assertPush, assertDelete} from '../redux/features/courseEntrySlice';

//Local
import {app_name} from '../util/constant';
import {Sync_File_Download_Post, OAuth_Redirect} from '../util/requests';
import '../static/css/main_ui.css';

//Hooks
import useWindowDimensions from '../util/hooks/useWindowDimensions';
import SchoolRouteRenderWall from '../components/schools/SchoolRouteRenderWall';

//SVG Assets
const downloadSvg = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
</svg>
const directSvg = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" className="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round"
        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
</svg>
const haltSvg = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" className="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round"
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
</svg>
const calendarSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path
    d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
  <path fill-rule="evenodd"
        d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
        clip-rule="evenodd"/>
</svg>
const googleSvg = <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`h-6 w-6 mr-3`}
                       viewBox="0 0 48 48">
  <path id="a"
        d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
</svg>
const notionSvg = <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`h-6 w-6 mr-3`}
                       viewBox="0 0 32 32">
  <path id="a"
        d="M18.405.068l-16.6 1.226C.466 1.41 0 2.285 0 3.334v18.198c0 .817.29 1.516.99 2.45l3.902 5.074c.641.817 1.224.992 2.448.934l19.277-1.167c1.63-.116 2.097-.875 2.097-2.158V6.192c0-.663-.262-.854-1.033-1.42a85.473 85.473 0 01-.133-.096L22.25.943c-1.282-.932-1.806-1.05-3.845-.875zM7.776 5.857c-1.574.106-1.931.13-2.825-.597L2.678 3.452c-.231-.234-.115-.526.467-.584l15.958-1.166c1.34-.117 2.038.35 2.562.758l2.737 1.983c.117.059.408.408.058.408l-16.48.992-.204.014zM5.941 26.49V9.11c0-.759.233-1.109.931-1.168L25.8 6.834c.642-.058.932.35.932 1.108v17.264c0 .759-.117 1.401-1.165 1.459l-18.113 1.05c-1.048.058-1.513-.291-1.513-1.225zm17.88-16.448c.116.525 0 1.05-.525 1.11l-.873.173v12.832c-.758.408-1.456.641-2.039.641-.932 0-1.165-.292-1.863-1.166l-5.709-8.982v8.69l1.806.409s0 1.05-1.457 1.05l-4.017.233c-.117-.234 0-.817.407-.933l1.049-.291v-11.49L9.144 12.2c-.117-.525.174-1.283.99-1.342l4.31-.29 5.94 9.098v-8.049l-1.514-.174c-.117-.643.349-1.11.931-1.167l4.02-.234z"/>
</svg>

const ExportCoursesPage = () => {
  document.title = app_name + " | Export Courses";

  //Redux state
  const saved_entries = useSelector((state) => state.courseEntry.ics_dl_entries);
  const configName = useSelector((state) => state.configSelect.selected_term);
  const dispatch = useDispatch();

  //Window Dimensions:
  const {height, width} = useWindowDimensions();
  const MOBILE_SWITCH = 1200;

  //Blob state
  const [blobURL, setBlobURL] = React.useState('');
  const [blobSize, setBlobSize] = React.useState('');

  //Download state
  const [dlName, setDLname] = React.useState('x');

  const [errMsg, setErrMsg] = React.useState('');

  // Helper FNS:
  const getSelectedCDIs = () => {
    let course_data_ids_list = [];

    for (const entry of saved_entries) {
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

    cookies.set('course_data_ids', JSON.stringify(course_data_ids_list), {path: '/'});
    OAuth_Redirect();
  }


  const postFileDownload = (file_type) => {
    //Assert for possibility of Empty Submission Request
    if (saved_entries.length < 1) {
      setErrMsg("There is nothing to generate... add some courses");
      return;
    }

    let course_data_ids_list = getSelectedCDIs();

    //Preform Request; Passing over callbacks to page's State Setters based on file_type
    Sync_File_Download_Post(file_type, setBlobURL, setBlobSize, setErrMsg, course_data_ids_list)
  }

  function RenderICSLink() {
    
    return (<>
      <a className="large_blue_btn flex items-center justify-center space-x-2" onClick={() => {
          postFileDownload("ics");
          setDLname("calendar.ics");
        }}>
        {downloadSvg}&nbsp;&nbsp;Calendar File (ics)&nbsp;{calendarSvg}</a>
    </>);

  }

  function RenderNotionCSVLink() {


    return (<>
      <a className="large_blue_btn flex items-center justify-center space-x-2" onClick={() => {
          postFileDownload("notion_csv");
          setDLname("notion_database.csv");
        }}>
        {downloadSvg}&nbsp;&nbsp;Notion Database (csv)&nbsp;{notionSvg}</a>
    </>);
  }

  function RenderGoogleCalLink() {
    return (<>
      <a className="large_blue_btn disabled flex items-center justify-center space-x-2" onClick={() => {
        //handleGoogleCalendar();
      }}>
        {directSvg}&nbsp;&nbsp;[COMING SOON!] Google Calendar&nbsp;{googleSvg}
      </a>
    </>);
  }

  function RenderAllLinks() {

    if(blobURL === 1){
      setErrMsg('');

      return (
      <>
        <br/>
        <p className="sub_title">Our server(s) are currently processing your request ... </p>
        </>
      )
    }

    if(blobURL !== '' && isNaN(blobURL)) {

      //TODO: Experimental, fix the double downloading...  It's because of `a.click()` i'm 99% sure
        const anchor = document.createElement('a');
        anchor.href = blobURL;
        anchor.download = dlName;

        setTimeout(() => {
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
        }, 10); //Tried to delay it... didn't work
      //TODO: Experimental, fix the double downloading...  It's because of `a.click()` i'm 99% sure
      
      return(
        <>       
        <br/>
        <p className="sub_title"> <b>Successful!</b> Check your Downloads Destination for `{dlName}` | {blobSize} bytes</p>
        </>
      );

    } else {

      if (saved_entries.length) {
        return (<>
          <br/>
          {RenderICSLink()}
          <br/>
          {RenderNotionCSVLink()}
          <br/>
          {RenderGoogleCalLink()}
        </>);
      } else {
        return (<>
          <br/>
          <a className="large_red_btn disabled flex">{haltSvg}&nbsp;&nbsp;Select courses first...</a>
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
            <span className="step_title r_font">1. Term:</span>
            <br/>
            {/* Config Selection */}
            <div className="r_font">
              <TermSelect/>
            </div>
            <br/>
            <br/>
            <div className="step_title r_font">2. Add your courses:</div>
            {/* Entire Course Selection Widget */}
            <CourseEntry reduxReference="ics_dl"/>
            <br/>
            <br/>
            <div className="step_title r_font">3. Export:</div>
            <span className="error_text r_font"> {errMsg} </span>
            {RenderAllLinks()}<br/><br/>
          </div>
        </div>
        <Footer/>
      </div>}/>
  );
}

export default ExportCoursesPage