import React from 'react'

//Local Utility
import ENDPOINT from '../../util/API';
import findCookie from '../../util/findCookie';
import { getCourseCodeFromTitle } from '../../util/dataFormatting';

//CSS imports
import '../../static/css/popup.css'

//Component imports
import SchoolConfigSelect from '../util/SchoolConfigSelect';
import PopUpPadding from '../util/PopUpPadding';

  //Course Entry Components:
  //TODO: switch to course search

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { assertPush, assertDelete, assertSet } from '../../redux/features/courseEntrySlice';



const CrnSettingPopUp = ({trigger, setTrigger, reload}) => {

    const saved_entries = useSelector((state) => state.courseEntry.crn_settings_entries);
    const configName    = useSelector((state) => state.configSelect.selected_term);
    const dispatch = useDispatch();


    //Usage state:

    const [liveCourses, setLiveCourses] = React.useState([]);    
    const [addCourses, setAC] = React.useState([]);

    // UX States

    const[status, setStatus] = React.useState(-1);

    // REDUX Dispatcher Functions:

    const addCourseCallback = (params) => {

      //Decoding the object send from AddCourseEntry to pass over to redux
  
      dispatch(assertPush({
        crn : params["crn"] , 
        cc : params["cc"] ,
        type : params["type"] ,
        reference : "crn_settings" //reference to state-used by this component
      }));
  
    }

    const deleteCourseCallback = (params) => {
      dispatch(assertDelete({
        index: params["index"],
        reference : "crn_settings"
      }))
    }

    //

    const getIndex = (sC , aC) => {
      return parseInt(sC.length + aC.length);
    }

    const statusDisplay = (state) => {
      

      //A number indicates: Default , Loading OR Success
      if(typeof(state) == 'number') {
        
        if(state === -1){ //Default
          return <>
                  <button className="btn btn-primary" onClick={submitPost}>Submit changes!</button>
          </>
        }

        if(state === 1){
          return <>
            <div>Successfully updated your courses</div>
            </>
        }

        if(state === 99){
          return <>
          <div>LOADING ...</div>
          </>
        }
      } 

      //A string indicates an ERROR

      if(typeof(state) == 'string') {
        return <>
          <div>{state}</div>
        </>
      }

    }

    const rebuildReduxEntries = (input) => {
      
      //? Input Breakdown: [ [ 0: Username , 1: CRN , 2: Config Name , 3: Course Title] , ... ]

      //Here we don't use addCourseCallback for building Redux State since we don't need to assert values- 
      //that where already previously asserted & saved:
      
      //? FIRST:
      //Rebuild Redux Entries based on current Config Name:

      let dump = []; 

      for(let i = 0; i < input.length; i++){

        if(input[i][2] == configName) {

          dump.push({
            'crn' : input[i][1],
            'cc' : input[i][3] , 
            'type' : true
          });

        }
      }

      //? SECOND: 
      // Grab all the Unregistered entries (type : false) and append them underneath:

      for(let j = 0; j < saved_entries.length; j++){

        if(saved_entries[j]['type'] == false){

          dump.push({ ...saved_entries[j]  });

        }
      }

      // Reset the state to dump:
      dispatch(assertSet({
        payload : dump , 
        reference : "crn_settings" //reference to state-used by this component
      }));

    }


    // Post new Course Codes & CRNs to API

    const submitPost = async () => {
  
      //Parsing raw:
      let course_codes = [];
      let crn_list = [];
  
      for(const entry of [...saved_entries]) {
  
        //? `entry` structure -> { `cc` : string , `crn` : int , `type` : boolean }
  
        let cc = entry.cc.trim();

        if(entry.type){ //If the entry was already registered (entry.type == true)

          //Clean up the title; get ONLY the course code 
          cc = getCourseCodeFromTitle(cc);

        }

        // Now that CC's been asserted, check for duplicates:
        if( !course_codes.includes(cc) ){ course_codes.push(cc); } //Duplicate Check for CCs

        if( !crn_list.includes(entry.crn) ){ crn_list.push(entry.crn); } //Duplicate Check for CRNs
      
      }

      const requestBody = JSON.stringify({ 
        "course_codes": course_codes, 
        "crn_list": crn_list, 
        "config_name" : configName
      });

      //ACTUAL REQUEST:

      const token = findCookie('access_token', document.cookie); //Auth Access Token

      const RESPONSE = await fetch(ENDPOINT + 'user/edit/schedule', {
        method: 'POST' , 
        headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token } ,
        body: requestBody
      });
      
      const respJSON = await RESPONSE.json();
      
      if(RESPONSE.status === 200) {       
        
        //Set the status to success:
        setStatus(1);
        //Reload the calendar page:
        reload();
      }
      
      if(RESPONSE.status === 404) {

        setStatus(respJSON.detail);
      }

    }


    //? USE EFFECT STATEMENTS : 

    React.useEffect(
        () => {
          rebuildReduxEntries(trigger);
        } , [trigger , configName] 
    );
    
    React.useEffect(
      () => {
      } , [saved_entries]
    )

    //Close the PopUp
    const closePopUp = () => {

      //TODO: Delete Redux Entries that are of type : false ?

      setTrigger(false); 
    }

    return (
    trigger ? (<div className="popup_bg">

    {/*Exterior Pop Up Padding */}
    <PopUpPadding executeClose={closePopUp}/>
    <div className="popup_inner">
        <button className="btn-close" onClick={() => { closePopUp(); }}/>
        <h3 className="main_pop_title">Edit CRNs displayed on your calendar:</h3>
        {/*Reference config id for API request && Course viewing */}
        <SchoolConfigSelect/>
        {liveCourses}
        {addCourses}
        <button className="btn btn-outline-success">Add CRN</button>
        {statusDisplay(status)}
        <br/>

    <br/>
    
        </div>
    </div>) : ''
    );
}

export default CrnSettingPopUp