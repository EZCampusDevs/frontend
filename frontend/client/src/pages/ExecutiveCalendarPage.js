
//Utility & Static:

  //Style & Formatting:
import '../static/css/executive.css';
import { locale2apiFormat, getDateDiff, timeFormat, apiFormat2date } from '../util/dataFormatting';
import { logVoid, reduxVoid } from '../util/logger';

  //API & Requests
import findCookie from '../util/findCookie';
import ENDPOINT from '../util/API';
import { tryExecutiveAuth } from '../util/requests';
import { app_name } from '../util/constant';

//Redux vitals
import { useSelector, useDispatch } from 'react-redux';
//Redux executive calendar state
import {reset, generateCurrent, backward, forward, resetSelectedCell} from '../redux/features/executiveCalendarSlice';
//Redux state for CRN & CC Entries
import { assertPush, assertDelete } from '../redux/features/courseEntrySlice';

//Redux state for User Property entry & Program maps:
import { setParameter, resetProgramMap, changeProgramMapParameter } from '../redux/features/executiveSlice';

//React & Components
import React from 'react'

import PageHeader from '../components/navbar/PageHeader';
import ExecutiveCalendar from '../components/executive/ExecutiveCalendar'
import ExecutiveProgramMaps from '../components/executive/ExecutiveProgramMaps';


import DeniedTemplate from '../components/state_template/DeniedTemplate';


const ExecutiveCalendarPage = () => {
  document.title = app_name + " | EPHMT"

  //* Page Auth stuff
  const [auth,setAuth] = React.useState(-1);

  //* Introduction Video Embed Link State
  const [introVid,setIntroVid] = React.useState("https://www.youtube.com/embed/lAJ-3da33JE?autoplay=0&mute=0&start=0");

  //* Courses & CRN state:

  const [add_CC_Singleton, setACC] = React.useState([]); //Course Code Singleton state
  //const [add_CRN_Singleton, setACRN] = React.useState([]); // CRN entries Singleton state
 
  //* Options Menu State:

  const [optionState, setOptionState] = React.useState(0);

  //! Minimize States:
  const [optionVis, setOptionVis] = React.useState(false); //Is or Is Not Minimized Options 
  const [calendarVis, setCalendarVis] = React.useState(false);  //Is or Is Not Minimized Exec Calendar 

  //* Date picker states (For start and end date):

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] =     React.useState(new Date());

  //* Visual Executive Calendar | Is Loading? | React State

  const [calPhase, setCalPhase] = React.useState(-1);
  const [errorMsgX, setEMX] = React.useState(<></>);

  //Redux stuff
    const dispatch = useDispatch(); 

    //Visual Executive Calendar Redux State
    const raw = useSelector((state) => state.executiveCalendar.data); //Full Data
    const currentWeek = useSelector((state) => state.executiveCalendar.current); // 7 Day Section of current data (based on offset)
    const offset = useSelector((state) => state.executiveCalendar.offset); //Offset determined by the user, what page are they on?

    //Jumbotron Redux State: (Selected Cell Display)
    const selectedDay = useSelector((state) => state.executiveCalendar.selected_day);
    const selectedTime = useSelector((state) => state.executiveCalendar.selected_time);
    
    //Executive Endpoint Request Body
    const exec_request_body = useSelector((state) => state.executiveEdit.request_body);

    //Singletons
    const saved_cc_entries = useSelector((state) => state.courseEntry.executive_calendar_cc_singleton); //CC Singleton Entries 
    //*const saved_crn_entries = useSelector((state) => state.courseEntry.executive_calendar_crn_singleton); //CRN Singleton Entries
    const programMaps =  useSelector((state) => state.executiveEdit.program_maps); //Program map selection

    //Active Program maps (For Restricting Bad Inputs)
    const activeProgramMaps = useSelector((state) => state.executiveEdit.program_maps_active);



    //Executive request body modifers
    const setRequestBodyParameter = (param, value) => {
      dispatch(setParameter({
        "param" : param,
        "value" : value
      }));
    }

    const setIntRequestBodyParameter = (param, value) => {
      dispatch(setParameter({
        "param" : param,
        "value" : parseInt(value)
      }));
    }


    //Modify Program Maps

    const getIndex = (sC , aC) => {
      return parseInt(sC.length + aC.length);
    }
  
  
    const renderSavedCourses = (entries, ref) => {
  
      if(entries.length === 0){
        return <div>You've got no specific course codes being included in the render yet...</div>
      }


      let dump = [];
  
      return dump;
    }

    //Jumbotron render state
    const renderJumbotron = (time, day) => {
    
    if(!time || !day) {
      return <></>;
    }
    
    return (<div className="jumbotron jumbotron-fluid executive_jumbotron" style={{backgroundColor : 'lightgrey'}}>
      <button
         onClick={() => {
          dispatch(resetSelectedCell({
        new_day : null,
        new_time : null
      }));
    }} className="btn btn-outline-dark executive_jumbotron_btn" 
      > ❌ </button>
    <div class="container">
      <h1 class="display-4"><b>{timeFormat(time)}</b> | Date: {day.date}</h1>
      <hr/>
      <p class="lead">Students with Class: {day.extra.students_with_class}</p>
      <p class="lead">Students with In-Person Class: {day.extra.students_with_in_person_class}</p>
      <br/>
    </div>
      </div> );
    } 

    const errorFormatJSX = (errorMsg, errorType) => {
      return (
        <>
        <br/>

        <div className="error_message_exec_h">
          {errorType} :
        </div>
        <hr/>

        <div className="error_message_exec">
          {errorMsg}
        </div>
        </>
      );
    }

    const getData = async (assert_raw) => {

        //clear error state
        setEMX('');
        //The `assert_raw` parameter is a boolean value that tells this function:
        // Wether or not to check Redux's current copy of the raw data, and if there is data, work with that data instead
        // of requesting a new POST for new calendar data. (This minimizes the n. of requests sent whilst page flipping)

        //Get Auth Cookie:
        const token = findCookie('access_token', document.cookie);  

        //Redux Request Body:
        let requestBody = exec_request_body;
        console.log(requestBody);

        //! Assert bad inputs before Doing any Requesting

        //* Check if there are 1 or more active (selected) program maps
        if(activeProgramMaps.length === 0){
          setEMX(errorFormatJSX("You haven't selected any program maps yet...", "Bad Input"));
          return;  
        }

        //* Check the day limits (end - start) , Minimum: 1 day, Maximum: 180 days

        const dateDifference_inDays = getDateDiff(false, exec_request_body.date_start, exec_request_body.date_end); //n. of days difference (int)

        if(dateDifference_inDays < 0){
          setEMX(errorFormatJSX("Date(s) invalid, please make sure your Start & End Dates are correct & in correct order.", "Date Input Error"));
          return;  
        }
        if(dateDifference_inDays > 181){
          setEMX(errorFormatJSX("Date Difference is too large! Please render ranges that are under a 6 month timeframe.", "Date Input Error"));
          return;  
        }

        //*If `assert_raw` is True & there is some data, WORK WITH IT and return.
        if(assert_raw && raw != null){
          dispatch(generateCurrent({
            raw
          }));
          return;
        }

        //Set the Calendar into loading state:
        setCalPhase(0); 
      
        const RESPONSE = await fetch(ENDPOINT + 'executive/plan/event', {
          method: 'POST' , 
          headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token },
          body: JSON.stringify(requestBody)
          }
        );

        if(RESPONSE.status === 200) { //If ok, set config state:
          setCalPhase(1);
  
          let respJSON = await RESPONSE.json();  
          reduxVoid("API RESPONSE: ***")
          console.log(respJSON); 
          respJSON = respJSON.detail;                            

          dispatch(reset({
              new_data : respJSON,
            }));

            dispatch(generateCurrent({
              raw
          }));
    
        }
        
        if(RESPONSE.status !== 200){

          //When it fails, set the calendars phase to "nothing being rendered"
          setCalPhase(-1);

          let respJSON = await RESPONSE.json();
          console.log(respJSON);

          //Check if Error detail is an array of errors:
          if(respJSON.detail && typeof(respJSON.detail[0]) === "object"){
            setEMX(errorFormatJSX(respJSON.detail[0].msg,
            'ERR: '+respJSON.detail[0].type+' ('+RESPONSE.status+')'));
            return;
          }

           setEMX(errorFormatJSX(respJSON.detail,'Error '+RESPONSE.status));
           return; 
        }
    
    } //End of getData()

    //!Defining Option States:

    //INTRODUCTION:

    const introVideoEmbed = (start, msg, timeDisp) => {
      return <div className="executive_intro_embed_link">
        {msg} <a className="executive_intro_embed_link_a" onClick={() => {setIntroVid(`https://www.youtube.com/embed/lAJ-3da33JE?autoplay=1&mute=0&start=${start}`)}}>{timeDisp}</a>
      </div>
    }

    const introParagraph = `The Event Planner Heat Map Tool (EPHMT) is designed for club and society executives to aid in planning events. EPHMT organizes and estimates student availability, both for inperson and virtual scopes.
    The numbers on the rendered heat map show the number of students that are free at each sampled time. Higher numbers (green) means more students are available, lower numbers (red) means less students are available.
    By clicking on a region on the heat map, the number of students expected to be attending inperson and virtual classes that specific day will be displayed. This will aid in understanding how many students you can expect to already be on campus and cater to inperson attendance.`

    const IntroductionJSX = () => {
      return (<div className="executive_option_wrapper">
        <div className="executive_pmap_title">Clubs & Societies - Event Planner Heat Map Tool (EPHMT)</div><br/>
      <div className="executive_intro_text">
      {introParagraph}
      </div>
        <hr/> 
        <div className="executive_cent">
        
        <iframe width="420" height="315"
            src={introVid} allow="autoplay" allowFullScreen> 
        </iframe>

        </div>
        {introVideoEmbed(0,"Introduction & Heatmap Functionality", "0:00")}
        {introVideoEmbed(110,"Example Application (Demo) ", "1:50")}
        {introVideoEmbed(179,"Step by. Step Guide (Tutorial)", "2:59")}
        {introVideoEmbed(568,`"All Cumulative" Program Maps Elaboration`, "9:28")}
        {introVideoEmbed(620, "Time Points Per Day In-depth", "10:20")}
        {introVideoEmbed(730,"Conclusion", "12:10")}
      </div>);
    }




    //PROGRAM MAPS:
    const ProgramMapsJSX = () => {
      return (
        <div class="executive_option_wrapper">
        <ExecutiveProgramMaps 
          exec_request_body={exec_request_body} 
          programMaps={programMaps}
        />
        </div>
      );
    }

    const DateRangeWrap = (daysN) => {
      if(daysN === -1) {
        return <div className="executive_sm_text">❌ This start & end date combination is NOT valid... <b>Fix it before proceeding</b> ❌</div>
      } else {
        return <div  className="executive_sm_text">✔️ You're searching over a {daysN} day timespan.</div> 
      }
    }

    //START AND END DATES:
    const DateRangesJSX = () => {
      return (
    <div className="executive_option_wrapper">
      
      <div className="executive_sm_text"><b>NOTE:</b> Make sure your selected date range is within the <i>term/semester</i> 's date range. </div>
      
      <br/><div className="executive_pmap_title executive_date_title"> Start Date: </div>
      
      {/* START DATE -> DATE PICKER (component is from LIBRARY IMPORT) */}

      <input type="date" className="form-control executive_date_picker" selected={startDate}   onChange={(date) => {
          setRequestBodyParameter("date_start", locale2apiFormat(date.toLocaleDateString()) );
          setStartDate(date); //React State is used here for the actual Date Picker Component
      }} />

      <br/><div className="executive_pmap_title executive_date_title"> End Date: </div>

      {/* END DATE -> DATE PICKER (component is from LIBRARY IMPORT) */}
      <input type="date" className="form-control executive_date_picker"  selected={endDate} 
        onChange={(date) => {
          setRequestBodyParameter("date_end", locale2apiFormat(date.toLocaleDateString()) );
          setEndDate(date); //React State is used here for the actual Date Picker Component
        }} /> 

      <br/><br/>
      {DateRangeWrap(getDateDiff(false, exec_request_body.date_start, exec_request_body.date_end))}
    </div>
      );
    }

    //ADVANCED PROPERTIES:
    const AdvancedPropertiesJSX = () => {
      return (
  <div className="executive_option_wrapper"><br/>
        <div className="executive_pmap_title">Advanced Properties :</div><br/>
        <hr/>
      <div  className="executive_side_by_side">
      
      <div>

      <br/>

      {/* Use Maximum Capacity Check Box & Redux Hooks */}
<div className="executive_secondary_container adv_prop">
      <input className="form-check-input" type="checkbox" id="umc"
      defaultChecked={exec_request_body.use_max_capacity}
      onChange={(e) => {
        const checked = e.target.checked;

        if(checked) {
          setRequestBodyParameter("use_max_capacity", true);
        } else {
          setRequestBodyParameter("use_max_capacity", false);
        }
      }}
      /> <label for="umc">Use Maximum Capacity</label> <br/>
    <div className="adv_prop_desc">
    Enabling this option will calculate the heat map using maximum seating rather than actual registration numbers. Best used when planning for an event before most students have registered for their courses.
    </div>
</div>
      <br/>

    <div className="executive_secondary_container adv_prop">
    <div>Time Points per Day | currently: {exec_request_body.samples_per_day} </div> <br/>
     <input type="range" class="form-range" min={0} max={48} 
     defaultValue={exec_request_body.samples_per_day} id="customRange2"
     onChange={(e) => {
      const MAX = 48; const MIN = 1;

      let input = e.target.value;

      if(input > MAX){
        setIntRequestBodyParameter("samples_per_day", MAX);
        e.target.value = MAX; //Reset Value if it's out of bounds
      } else if(input <= MAX && input > MIN) {
        setIntRequestBodyParameter("samples_per_day", input); 
      } else {
        setIntRequestBodyParameter("samples_per_day", MIN);
        e.target.value = MIN; //Reset Value if it's out of bounds
      }

     }}

     />
           <div className="adv_prop_desc">
This parameter determines the amount of time points the availability calendar will render. 1 timepoint is equivalent to 1 row on the calendar.
      </div>
     </div>
     </div>

      {/*Course code inputs*/}
      <div>
      {renderSavedCourses(saved_cc_entries, "executive_calendar_cc_singleton")}
      {add_CC_Singleton}
      <button className='btn btn-outline-success bt_centre'  >Add Course Code</button>
      </div>

    </div>
    <br/>
  </div>
      );
    }

    //! Properties Menu Switch Statement

    const propertySwitch = (int) => {
      switch(int) {
        case 0: // Program Maps
          return IntroductionJSX();
  
        case 1: // Date Ranges
        return ProgramMapsJSX();

        case 2:
          return DateRangesJSX();

        case 3:
          return AdvancedPropertiesJSX();

        default:
      }
    }

        //Foward and backward hooks for Executive Calendar 
      const forwardHook = ()  => {
          dispatch(forward());
        }
    
      const backwardHook = () => {
          dispatch(backward());
        }

    //! Calendar Phase Switch Statement (Active, Loading, Uninitialized)
    const calPhaseSwitch = (phase) => {
      //TODO: Write nicer JSX returns for cases -1, 0

      //Clear Jumbotron just in-case


      if(calendarVis){
        return <><button className="fas fa-angle-down arrow btn btn-danger executive_maximize_btn"  onClick={() => {setCalendarVis(false)}}> Open Heatmap Calendar</button></>
        
      }


      switch(phase) {
        case -1: // Exec Calendar is Uninitialized (Untouched since the page refresh)
          return <div className="executive_sm_text" style={{textAlign : "center"}}> Nothing has been rendered yet...</div>

        case 0: // Exec Calendar is Loading (It's already received a user prompt)
          return <div className="executive_sm_text" style={{textAlign : "center"}}> 
          Loading ... <br/><div className="b_loader"></div>
          </div>

        case 1: // Exec Calendar is Loaded in and Renders it's visual component:
          return <>
          <ExecutiveCalendar 
            currentWeek={currentWeek} 
            forward={forwardHook}
            backward={backwardHook}
            visualProperty={{
            colors: [ 
              ["rgb(200, 11, 30)" , "rgb(151, 8, 23)"] , 
              ["rgb(237, 51, 10)", "rgb(184, 40, 8)"] , 
              ["rgb(237, 93, 10)", "rgb(195, 76, 8)"] , 				
              ["rgb(237, 141, 10)", "rgb(173, 103, 7)"] , 
              ["rgb(223, 164, 28)" , "rgb(184, 135, 23)"],
              ["rgb(214, 192, 30)" , "rgb(195, 175, 27)"],
              ["rgb(192, 203, 37)" , "rgb(169, 178, 32)"] , 
              ["rgb(141, 194, 38)", "rgb(141, 148, 38)"] , 
              ["rgb(108, 194, 38)", "rgb(108, 145, 38)"] , 
              ["rgb(23, 206, 31)", "rgb(23, 162, 31)"] , 
            ],
            min: raw.worst_case_people_available,
            max: raw.best_case_people_available
            }}
          />  
          <br/>
           <button class="btn btn-info fullwidth_minimize" onClick={() => {
            setCalendarVis(true);
            
            dispatch(resetSelectedCell({
              new_day : null,
              new_time : null
            }));

            }}>Minimize Heatmap Calendar</button> <br/><br/>

          </>

      default:
      }
    }


    //! EFFECTS AND HOOKS

    //On Component Mount, Run the AuthWall and get the state set:
    React.useEffect(
      () => {
        const respStatus = tryExecutiveAuth().then(
          (status) => {
            if(status === 200){ setAuth(1)  }
            if(status === 401){ setAuth(-1) }
            if(status === 404){ setAuth(-2) }
          }
        );

        const default_start_date = new Date();

        let default_end_date = new Date();
        default_end_date.setMonth(default_end_date.getMonth()+1);

         setRequestBodyParameter("date_start", locale2apiFormat(default_start_date.toLocaleDateString()) );
         setRequestBodyParameter("date_end", locale2apiFormat(default_end_date.toLocaleDateString()) );
      }, []
    );

    React.useEffect(
          () => {
          logVoid("RE-RENDERED");
           getData(true); //Get's next week
           setEMX('');
          }, [offset]
    );

    //Listening on executive request body changes
    React.useEffect(
      () => {
        setStartDate(apiFormat2date(exec_request_body["date_start"]));
        setEndDate(apiFormat2date(exec_request_body["date_end"]));

      }, [exec_request_body]
    );
            


    //! RETURN STATEMENT 


    const optionCSS = (stateNum) => {
      if(stateNum === optionState){
        return "selected_option_entry";
      }
      return "option_entry"
    }

    return (
    <>
    <PageHeader/>
    {(auth === 1) ? <div class="executive_page_main_wrapper">        

    {/* optionVis is True : IS Minimized | optionVis is False : IS Open for Use   */}
    {optionVis ? 
    <>
    <button className="fas fa-angle-down arrow btn btn-danger executive_maximize_btn" onClick={() => {setOptionVis(false)}}> Open Properties</button> 
    </>
    : 
    <>
      <div className="properties_wrapper"> 

        {/*Options Menu */}
        <div className="options_menu">
          <div class={optionCSS(0)} onClick={() => {setOptionState(0)}}>1. Introduction</div>
          <div class={optionCSS(1)} onClick={() => {setOptionState(1)}}>2. Program Maps</div> 
          <div class={optionCSS(2)} onClick={() => {setOptionState(2)}}>3. Date Ranges</div>
          <div class={optionCSS(3)} onClick={() => {setOptionState(3)}}>4. Advanced Properties</div> <br/>

          {/* <button class="btn btn-info option_menu_button" onClick={() => {setOptionVis(true)}}>Minimize</button> <br/> */}
          <button class="btn btn-warning option_render_button" onClick={() => {getData()}}>5. Render Availability Calendar</button>
        
          <div className="error_message_exec">
            {errorMsgX}
            </div>
        
        </div>
  
        {/*Current State */}
        <div>
        {propertySwitch(optionState)}
        </div>

    {/* Minimize Button */}
      </div>
      <button class="btn btn-info fullwidth_minimize" onClick={() => {setOptionVis(true)}}>Minimize Properties Menu</button> <br/>
      </>

    }



      <br/>

    <br/>

    {/*Selected day Jumbotron */}
    {renderJumbotron(selectedTime,selectedDay)}

    {/*The Executive Calendar is Rendered within this function: */}
    {calPhaseSwitch(calPhase)}

    <div style={{textAlign : "center"}}>
    ©️ ezcampus.ca  |  2021 - 2023

    </div>
    
    </div> :  <> 
    <DeniedTemplate/>
  </>}
    
    </>
  ) 
}

export default ExecutiveCalendarPage