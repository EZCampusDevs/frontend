import React from 'react'

// General components :
import PageHeader from '../components/navbar/PageHeader';
import SchoolConfigSelect from '../components/util/SchoolConfigSelect';

import Calendar from '../components/calendar/Calendar';

// Optimizer Specific components:
import AvailabilitySelectionCalendar from '../components/optimizer/AvailabilitySelectionCalendar';
import OptimizeParameter from '../components/optimizer/OptimizeParameter';
import OptimizeButton from '../components/optimizer/OptimizeButton';
import OptimizeResultsTable from '../components/optimizer/OptimizeResultsTable';

// Local Imports :
import ENDPOINT from '../util/API';
import '../static/css/optimizer.css';
import { decode_OptimizeCalendar_2_API, findCookie } from '../util/dataFormatting'; 
import { logVoid } from '../util/logger';
import { cParse } from '../util/calendarJSON';

// Redux :
import { useSelector, useDispatch } from 'react-redux';
import { assertPush, assertDelete } from '../redux/features/courseEntrySlice';



const OptimizerPageV4 = () => {

  //React State:
  const [advProp, setAP] = React.useState(false); //Advanced Properties React State Toggle
  const [addCourses, setAC] = React.useState([]);
  const [savedCourses, setSC] = React.useState([]);

  const [pF, setPF] = React.useState();

  //Result Calendar States:
  const [schedule, setSchedule] = React.useState([]);
  const [currentWeek, setCurWeek] = React.useState([0,7]);

  const [resultsTable, setRT] = React.useState(<></>);

  //Redux:
  const configName = useSelector(   (state) => state.configSelect.selected_term);
  const saved_entries = useSelector((state) => state.courseEntry.optimizer_cc_singleton_entries);

  //optimizer redux
  const O_optimizer_cal  = useSelector((state) => state.optimizer.optimizer_calendar);
  const O_request_body   = useSelector((state) => state.optimizer.request_body);

  const dispatch = useDispatch();

  //API FETCH CALL
  const requestAPI = async () => {
  
  //& PRE-PROCESSING :
      // Deep-copy ( clone ):
          let postBody = JSON.parse(JSON.stringify(O_request_body));

      // Set the available times to the decoded :
          postBody["optimizer_criteria"]["available_times"] = decode_OptimizeCalendar_2_API( O_optimizer_cal );

      // Append config Name
          postBody["config_name"] = configName;
          console.log(saved_entries);

      //Turn Append the course codes from `saved_entries` List(Objects) to List(String)
      for(let i = 0; i < saved_entries.length; i++){ 
        let savedEntry = saved_entries[i]; //Single Entry from saved entries list (Object)
        postBody["course_codes"].push(savedEntry["cc"])
      }
    
      //! DEBUG CONSOLE LOGGING:
      logVoid("Post Body:");
      console.log(postBody);
      //! DEBUG CONSOLE LOGGING:


    //& ACTUAL REQUEST CALL :

      const RESPONSE = await fetch(
        /*Endpoint URL */ ENDPOINT+"optimizer/execute", 
        /*Req Params */ {
        method: 'POST', 
        headers: {'Content-Type' : 'application/json' } ,
        body: JSON.stringify(postBody)
          } 
      );

      let api_result = await RESPONSE.json();

      const status = RESPONSE.status;
      api_result = api_result.detail;

      //! DEBUG CONSOLE LOGGING:
      logVoid("Optimizer Response: ");
      console.log(api_result);
      console.log(status);
      //! DEBUG CONSOLE LOGGING:

      if(status === 200){
        //Set schedule to parsed response schedule, (that second entry that's empty infers there are no club events to display)
          setSchedule( cParse(api_result.schedule), [] );
          setPF(1); 

          //Construct Results Table JSX
          const rT = <OptimizeResultsTable crns={api_result.crns} simple_manifest={api_result.simplified_manifest}/>
          setRT(rT);
          setAC([]);
      }  

  }


  const showMandatoryOptions = () => {
    

    //3rd Step Sub-Conditional
    const showMandatoryExtension = (toggle) => {
      
      if(toggle === true){
        return (<>
        <div className="ics_config_wrap card card-body optimizer-card-extra">

        <h6>Select the times you want to be at school:</h6>

          <AvailabilitySelectionCalendar  start={8} end={23}/> 
        </div>
        
        {/* ADVANCED PROPERTIES SECTION: */}
        <button className='btn btn-dark optimizer-demo-btns' onClick={() => {setAP(!advProp)}}>Advanced Properties</button>
        {showAdvancedProperties(advProp)}
        </>);
      } else {return <></>;}
    }

    //*Variable that indicates if the user has saved atleast 1 or more course code(s) on the optimizer page or not:
    const courseCodesInteraction = saved_entries.length >= 1 ? true : false;

    //? Main Rendering:

    if(configName){
      return (
        <>
        <div className="ics_config_wrap card card-body optimizer-card-extra">

          <h6>Selected Courses:</h6>

          {"add rendering of added courses here"}
          {addCourses.length === 0 ? <div className="ics_ng">You haven't added any courses yet...</div> : addCourses}

          <br/>
            <button className='btn btn-outline-dark ics_big_btn' onClick={()=>{/*Add Course */}}> Add Course </button>
          <br/><br/>
        </div>

        {showMandatoryExtension(courseCodesInteraction)}


        </>
      );
    } else {
      return <></>;
    }
  }

  // dispatch( edit_key({ nest : "optimizer_criteria" , key ,  value }) );
  const showAdvancedProperties = (toggle) => {
    if(toggle){

      return (
      
      <div className="card card-body optimizer-card-extra ics_config_wrap">
      {/* Parameters with Weights (Sliders) */}

      <OptimizeParameter parameter={"is_virtual"} callbackDispatch={dispatch} weighted={true} requestBody={O_request_body}/>
      <OptimizeParameter parameter={"high_prof_rating"} callbackDispatch={dispatch} weighted={true} requestBody={O_request_body}/>
      <OptimizeParameter parameter={"max_capacity"} callbackDispatch={dispatch} weighted={true} requestBody={O_request_body}/>

      {/* Parameters without Weights (Only checkboxes) , 
      NOTE: these params aren't nested in optimizer_criteria either */}
      
      <OptimizeParameter parameter={"ensure_open_seats"} callbackDispatch={dispatch} weighted={false} requestBody={O_request_body}/>
      <OptimizeParameter parameter={"ensure_restrictions_met"} callbackDispatch={dispatch} weighted={false} requestBody={O_request_body}/>
      </div>);
    }

    if(!toggle) {
      return <></>
    }

  }

  //*Redux Callbacks for Optimizer Course Entry: 
    const addCourseCallback    = (params) => {
      //Decoding the object sent from AddCourseEntry to pass over to redux
      dispatch(assertPush({
        crn : params["crn"] , 
        cc : params["cc"] ,
        type : false ,
        reference : "optimizer_cc_singleton" //reference to state-used by this component
      }));
    }

    const deleteCourseCallback = (params) => {
      dispatch(assertDelete({
        index: params["index"],
        reference : "optimizer_cc_singleton"
      }));
    }
    const getIndex = (sC , aC) => { return parseInt(sC.length + aC.length);} //index helper
  
  //* JSX rendering for Redux Course Entry Data:




    //Results Calendar Associated Functions

    //Display Calendar functions:
    const scrollForward = async () => {       
      if(currentWeek[1] < schedule.length-1){
        setCurWeek([currentWeek[0]+7,currentWeek[1]+7]);
       }
    }
  
  const scrollBackward = async () => {
    if(currentWeek[0] > 0){
      setCurWeek([currentWeek[0]-7,currentWeek[1]-7]);
     }  
    }

  const renderResultCalendar = () => {

    //Check if Calendar is render-able:
    if(schedule.length >= 1){
      return (<>

{/* CALENDAR & CONTROLS CONTAINER   */}
    <div className="optimizer-calendar-container">

    {/* PREVIOUS | LEFT Controller */}
    <a className="optimizer-control-prev" 
       role="button" 
       onClick={() => {scrollBackward()}}>
      <div class="carousel-control-prev-icon" aria-hidden="true"></div>
    </a>
      
    {/* Actual Calendar Component Wrapper */}

    <div className=" optimizer_result_calendar" 
        tabIndex='0'   
        onKeyDown={(e) => 
          {
          if(e.code === 'ArrowRight' ) { scrollForward() } 
          if(e.code === 'ArrowLeft') { scrollBackward() }
          }
        }>
    
    <Calendar current={[...schedule.slice(currentWeek[0],currentWeek[1])]} personalized={false} />  

    </div>

    {/* NEXT | RIGHT Controller */}
      <a className="optimizer-control-next" 
      role="button" 
      onClick={() => {scrollForward()}}>

      <div class="carousel-control-next-icon"></div>

      </a>

    </div>
{/* END OF CALENDAR & CONTROLS CONTAINER   */}      




</>);

    //* Return empty element if calendar can't be rendered yet
    } else { return <></>; }

  }

  const renderStep = (focus) => {

    if(!focus) {
      return (<>
      <div className="ics_config_wrap card card-body optimizer-card-extra">
        <SchoolConfigSelect/>
        <br/>
      </div>


        {showMandatoryOptions()}

      <br/>
      {/* RENDER Optimizer BUTTON */}
      <br/><br/>
      
      <OptimizeButton 
      requestCallback={requestAPI} config={configName} ccEntries={saved_entries}
      />


      
      </>);

    } else {
      return <>

          {/* YOUR PERSONALIZED SCHEDULE HEADING: */}

          <div className="optimizer-schedule-heading optimizer-dark-bubble">
          <button className="btn btn-warning btn-go-back" onClick={() => {setPF(!pF)}}> {" Go back to settings."} </button>
            <h4>Your personalized schedule: </h4>
            
          </div>
            {renderResultCalendar()}

          <div className="optimizer-dark-bubble">
            Additional Information about this rendering:
          </div>
          {resultsTable}

      </>
    }
  }




  return (
    <>
    <PageHeader/>
    <div class="cc_title_break">
      <h1 className="optimizer-heading">Course Schedule Optimizer: </h1>
      <h6> Alpha 0.0.4 - Demo Fest Build </h6>
    </div>
    <br/>

    {renderStep(pF)}

    </>
  )
}

export default OptimizerPageV4