import React from 'react'


//Component imports
import PageHeader from '../components/navbar/PageHeader';
import AddCourseEntry from '../components/course_entry/AddCourseEntry';
import SavedCourseEntry from '../components/course_entry/SavedCourseEntry';

import SearchAddCourseEntry from '../components/course_entry/SearchAddCourseEntry';

import CourseSearchWidget from '../components/course_search/CourseSearchWidget';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { assertPush, assertDelete } from '../redux/features/courseEntrySlice';

//Local 
import { app_name } from '../util/constant';

import '../static/css/main_ui.css';

//Hooks
import useWindowDimensions from '../util/hooks/useWindowDimensions';

import ENDPOINT from '../util/API';
import SchoolConfigSelect from '../components/util/SchoolConfigSelect';

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

  
  const addCourseCallback = (params) => {

    //Decoding the object sent from AddCourseEntry to pass over to redux
    dispatch(assertPush({
      crn : params["crn"] , 
      cc : params["cc"] ,
      type : false ,
      reference : "ics_dl" //reference to state-used by this component
    }));
  }

  const deleteCourseCallback = (params) => {
    dispatch(assertDelete({
      index: params["index"],
      reference : "ics_dl"
    }))
  }

  const getIndex = (sC , aC) => {
    return parseInt(sC.length + aC.length);
  }




  const addCourse = () => {
    //spreading the old addCourses React state, along with adding that 1 new elm
    setAC(
        [...addCourses, <AddCourseEntry 
          callback={addCourseCallback} 
          index={getIndex(savedCourses, addCourses)} 
          configName={configName}
          cssExtra={{
            wrapper : "ml-6 flex",
            cc :      "large_text_field sm:text-md",
            crn :     "large_text_field sm:text-md",
            button :  "large_blue_btn"
          }}
        />]
      );
  }


  const renderSavedCourses = (entries) => {

    let dump = [];

    for(const [index, saved] of entries.entries()){
      dump.push(
      <SavedCourseEntry 
        cc={saved.cc} 
        crn={saved.crn} 
        index={index} 
        callback={deleteCourseCallback} 
        flavor={"ics"}
      />
      );

    }

    return dump;
  }

  const handleSubmit = (configName, entries) => {
    
    setBlobURL(1);

    console.log("RECIEVED : "+configName);

    let reqBody = {
      "course_codes": [],
      "crn_list": [],
      "config_name" : configName
    }

    //&Populate req body 

    for(const entry of entries){
      
      //Filter CC to make sure duplicate with different caps/whitespace doesn't get thru
      let ccFilted = entry.cc.trim().toUpperCase();

      if(reqBody["course_codes"].includes(ccFilted) == false){
        reqBody["course_codes"].push(ccFilted);
      }

      if(reqBody["crn_list"].includes(entry.crn) == false && !isNaN(entry.crn) ) {
        reqBody["crn_list"].push(entry.crn);
      }

    }

    //* API Request for Download
    
    fetch(ENDPOINT+'download/courses?' , 

    //Request Parameters
        {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },

    //Post Body to API
        body: JSON.stringify(reqBody),
    })
    
    //Save the response as a file BLOB
    .then(response => {
      console.log(response);

      //If response is OK, assume it's a file response
      if(response.status == 200){
        return response.blob(); 
      } 

      if(response.status == 406){
        response.json().then(respJSON =>
          setErrMsg(respJSON.detail)
        );
        return null;
      }

      })
    
    //Once it's converted into file blob, set download link via HREF url object
    .then(data => {

        if(data == null){
          setBlobURL('');
          return;
        }
        console.log("GETS HERE?")
        const href = window.URL.createObjectURL(data);
        setBlobSize(data.size);

        //Clear error if there was any
        setErrMsg('');

        return setBlobURL(href);
    }).then(
        () => {RenderLink();}
    )
    .catch((error) => {
        console.error('Error:', error);
    });  

    console.log(reqBody)

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
          <button className="btn btn-primary ics_big_btn" onClick={() => {handleSubmit(configName, saved_entries)}}>
        Re-Generate My Calendar File
      </button>
        </>
      )
    } else {
      return (
        <>
        <br/>
        <button className="btn-primary btn-lg ics_big_btn" onClick={() => {handleSubmit(configName, saved_entries)}}>
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
    <>
    <PageHeader/>
    <br/><br/>
    <div className="flex ml-48">
    

      <div className="">
              {/* <iframe allow="fullscreen;" width={iframeViewportScale(true, width)} height={iframeViewportScale(false, width)}
                src="https://www.youtube.com/embed/6FzGmNO8a0U?autoplay=1&mute=0">
              </iframe> */}
      </div>

      <div className="">
          <span className="r_font text-3xl font-bold">Step 1. Select a semester:</span> 
          {/* <p className="ics_p">* Select the <i>term/semester</i> you're generating this calendar file for, don't worry about <b>future terms</b> since we'll update this selection as time goes on.</p> */}
          <br/><br/>
          {/* Config Selection */}
          <div className="r_font">
          </div>

          <br/>
          <br/>
        <div className="r_font text-3xl font-bold">Step 2. Add your courses:</div> 

        {addCourses.length === 0 ? <div className="">You haven't added any courses yet...</div> : addCourses}

        <CourseSearchWidget/>

        <br/>

    {/* ADD COURSE BUTTON  */}
    <button className="ml-6 w-72 flex items-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
        onClick={addCourse} >

      <svg clip-rule="evenodd" fill="#FFFFFF" className="w-6" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12.002 2c5.518 0 9.998 4.48 9.998 9.998 0 5.517-4.48 9.997-9.998 9.997-5.517 0-9.997-4.48-9.997-9.997 0-5.518 4.48-9.998 9.997-9.998zm-.747 9.25h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z" fill-rule="nonzero"/></svg>
      <span className="ml-3">Add Course</span>
    </button>

        <br/>
        <br/>
        <br/>
        <div className="r_font text-3xl font-bold">Step 3. Generate & Download:</div> 

        <span className="ics_err_msg">  {errMsg} </span>
        
        {RenderLink()}<br/><br/>

      
      </div>

    </div>
    </>
  );
}

export default IcsPage