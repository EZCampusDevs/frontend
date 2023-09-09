import React from 'react'

import PageHeader from '../components/navbar/PageHeader';
import LengthCount from '../components/util/LengthCount';

import {POST_Report, GETALL_TYPES_Report} from '../util/requests';

const ReportPage = () => {

  //############## UTILITY ####################

  const checkSVG = <svg className="mr-2 w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>

  const xSVG = <svg className="mr-3 w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>

  function generalizeFormat(dataArray) {
    let generalized = dataArray.map(item => {
      // Extract all keys from the object
      const keys = Object.keys(item);
      
      // Create a new object with generalized keys for the first two items
      const generalizedObject = {
        id: item[keys[0]],
        name: item[keys[1]]
      };
  
      // Copy other properties from the original object to the generalized object
      for (let i = 2; i < keys.length; i++) {
        generalizedObject[keys[i]] = item[keys[i]];
      }
  
      return generalizedObject;
    });

    generalized.push({id: -1, name : "Select an Option..."});
    return generalized;
  }

  //############## UTILITY ####################

  const [browsers,setBrowsers] = React.useState(null);
  const [operatingSystems,setOperatingSystems] = React.useState(null);
  const [reportTypes,setReportType] = React.useState(null);

  const[browserCheck, sBC] = React.useState(xSVG);
  const[operatingSystemCheck, sOC] = React.useState(xSVG);
  const[reportTypeCheck, sRC] = React.useState(xSVG);

  const selectedBrowser = React.useRef('');
  const selectedOperatingSystem = React.useRef('');
  const selectedReportType = React.useRef('');
  const descriptionField = React.useRef('');

  const[descLen, setDL] = React.useState(0);

  const buildReportOptions = async (type, cb) => {
    let payload = await GETALL_TYPES_Report(type);
    payload = generalizeFormat(payload);
    
    //Creation of JSX Options
    let dump = [];
    if (payload) {
      for (const entry of payload) {
        if (entry.id === -1) {
          //TODO: might be bad for scaling w/ all those chars? Insert a disabled option as a divider after the option with id -1
          dump.unshift(<option disabled>────────────────────────</option>);
        }
        dump.unshift(<option value={entry.id}>{entry.name}</option>);

      }
    }
    cb(dump);
    return;
  };

  const checkDropdownRef = (state, setCheck) => {
    if(state > 0){ setCheck(checkSVG); } 
    else { setCheck(xSVG); }
  }

  const lenCount = (msg, count, min, max) => {
    //Make sure the count is between min, and max
    let svg = (count > min && count < max ) ? checkSVG : xSVG

    return(
      <span className="flex items-center sub_title r_font">
      {svg} {msg} <span className="text-slate-800 dark dark:text-slate-400 ml-12"> [ {count} / {max} character limit] </span>
      </span>
    );
  }


  React.useEffect(
    () => {

      //* On Mount, load all options:
      buildReportOptions("Browser", setBrowsers);
      buildReportOptions("OperatingSystem", setOperatingSystems);
      buildReportOptions("ReportType", setReportType);
    } , []);
    
  //! CAUTIONS THE USER THAT IF THEY RELOAD / LEAVE, ALL INFORMATION WILL BE GONE FROM FORM  
  React.useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
  
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []); 

  return (
    <>
    <PageHeader/>
    <section class="py-5">
        <div class="container">
            <div class="row mb-5">
                <div class="col-md-8 col-xl-6 text-center mx-auto">
                    <p class="fw-bold text-success mb-2">EZCampus Reports</p>
                    <h2 class="fw-bold main_title">Got an Inquiry?</h2>
                </div>
            </div>
            <div class="col-md-6 col-xl-10">
                <div></div>
            </div>
            <div class="row d-flex justify-content-center">
                <div class="col">
                        {/* <div class="mb-3"><input class="medium_search_bar r_font flex-grow" type="text" id="name-1" name="name" placeholder="Name"/></div> */}

                      <div>
                      <span className="flex items-center sub_title r_font mb-1">{browserCheck} The Browser I'm currently on:</span>

                        <select
                          class="large_select_field"
                          ref={selectedBrowser}
                          onClick={e => { checkDropdownRef(selectedBrowser.current.value, sBC); }}>
                            {browsers}
                      </select>
                      </div> <br/>

                      <div>
                      <span className="flex items-center sub_title r_font mb-1">{operatingSystemCheck} My Operating System: </span>

                        <select
                          class="large_select_field"
                          ref={selectedOperatingSystem}
                          onClick={e => { checkDropdownRef(selectedOperatingSystem.current.value, sOC); }}>
                            {operatingSystems}
                      </select>
                      </div> <br/>

                      <div>
                      <span className="flex items-center sub_title r_font mb-1">{reportTypeCheck} Type of Inquiry or Report: </span>

                        <select
                          class="large_select_field"
                          ref={selectedReportType}
                          onClick={e => { checkDropdownRef(selectedReportType.current.value, sRC); }}>
                            {reportTypes}
                      </select>
                      </div> <br/>
                      {lenCount("Report Body", descLen, 16, 512)}
                        {/* <div class="mb-3"><input class="medium_search_bar r_font flex-grow" type="email" id="email-1" name="email" placeholder="Email"/></div> */}
                        <div class="mb-3"><textarea 
                        ref={descriptionField} 
                        onChange={() => {
                          if(descriptionField.current.value) {
                            setDL(descriptionField.current.value.length);
                          } else {
                            setDL(0);
                          }
                        }}
                        class="r_font medium_search_bar" id="message-1" name="message" rows="9" placeholder="Description of Report..."></textarea></div>
                        <div><button class="btn btn-primary shadow d-block w-100" >Send</button></div>
                </div>
            </div>
        </div>
    </section>
    </>
  );

}

export default ReportPage