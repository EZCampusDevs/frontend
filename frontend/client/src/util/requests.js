import findCookie from "./findCookie";
import Cookies from 'universal-cookie';

//ENDPOINT DEFINITIONS
let ENDPOINT = "https://api.ezcampus.org/"
let SEARCH_ENDPOINT = `https://search.ezcampus.org/searchIndex/`;

// Requests Console Logger
const reqPrint = (string) => {
  console.log('%c [ requests.js ] : '+string, 'background: #222; color: #bada55')
}

//Function that switches based on Hostname, either to our production endpoints or localhost stuff

const API_Switch = () => {
  var currentDomain = window.location.hostname;
  reqPrint("Current Hostname: ");
  console.log(currentDomain);

  var checkForLocalhost_Regex = /^(https?:\/\/)?localhost/i;
  const isLocalhost = checkForLocalhost_Regex.test(currentDomain);

  if (isLocalhost === true) {
    console.log("IS LOCAL...");
    ENDPOINT = "http://localhost:8000/";
    SEARCH_ENDPOINT = `https://search.ezcampus.org/searchIndex/`; //! Temp since localhost glassfish was annoying
  }
}

API_Switch();

//const SEARCH_ENDPOINT = `https://search.ezcampus.org/searchIndex/`

export async function InitRequest() {

    const token = findCookie('access_token', document.cookie);

    const response = await fetch(
      /*Endpoint URL */ ENDPOINT, 
      /*Req Params */{method: 'GET', headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token } } 
    )

    console.log(response)
    if(response.status === 200){
      return 1;
    }

    if(response.status === 401){
      return 0;
    }


}

export async function SchoolTermRequest(redux_identifier, body, callback) {

//export async function SchoolTermRequest() {
    const RESPONSE = await fetch(SEARCH_ENDPOINT + 'school/term', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
      const ResponseJSON = await RESPONSE.json();
      callback(redux_identifier, ResponseJSON); // Redux Callback
      return;
}

export async function SearchCoursesByTerm(searchTerm, page, resultsPerPage, termId, callback) {


  const RESPONSE = await fetch(SEARCH_ENDPOINT + 'search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "search_term": searchTerm , "page": page, "results_per_page": resultsPerPage, "term_id": termId }) 
                        //TODO: Figure out page and results per page thing (Also fix the Java Micro-Service for this)
  });

    let ResponseJSON = await RESPONSE.json();
    console.log(ResponseJSON);
    callback(ResponseJSON);
    return;
}


// ######################### ICS Requests #########################

                              // fn , fn , fn , fn , Array<int>

export function Sync_ICS_Post(setBlobURL_callback, setBlobSize_callback, setErrMsg_callback, render, courseDataIds) {
      
  setBlobURL_callback(1);

  //* API Request for Download
  
  fetch(ENDPOINT+'download/ics/courses?' , 

  //Request Parameters
      {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },

  //Post Body to API
      body: JSON.stringify({"course_data_ids": courseDataIds}),

  }).then(response => {  //& .then #1, Save the response as a file BLOB

    //If response is OK, assume it's a File response
    if(response.status === 200){
      return response.blob(); //*Propagates to the next .then 
    } 

    if(response.status === 406){
      response.json().then(respJSON =>
        setErrMsg_callback(respJSON.detail)
      );
      return null;

  }}).then(data => {   //& .then #2 Once it's converted into file blob, set download link via HREF url object

      if(data == null){
        setBlobURL_callback('');
        return;
      }

      const href = window.URL.createObjectURL(data);
      setBlobSize_callback(data.size); //For Display purposes

      //Clear error if there was any
      setErrMsg_callback('');

      return setBlobURL_callback(href);

  }).then( //& .then #3 Render Callback once everything has been set
      () => {render();}
  )
  .catch((error) => {
      console.error('Error:', error);
  });  
}

// ######################### Executive Requests #########################

export async function tryExecutiveAuth () {
    
  //Grab the Cookie:
  const token = findCookie('access_token', document.cookie);  

  //Make The Request:
  const RESPONSE = await fetch(ENDPOINT + 'user/check_exec_auth', {
      method: 'GET' , 
      headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token }
      }
  );

  return RESPONSE.status;

}


// ######################### Calendar-Related Requests #########################

export async function CalendarPlaceholder(course_data_ids, callback) {

  //course_data_ids is supposed to be Array of Ints

  const RESPONSE = await fetch(ENDPOINT + 'placeholder/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({  "course_data_ids": course_data_ids, "course_ids" : []}) 
                        //TODO: Figure out page and results per page thing (Also fix the Java Micro-Service for this)
  });

    let ResponseJSON = await RESPONSE.json();
    callback(ResponseJSON);
    return;
}

// ######################### Google Calendar | OAuth Related Requests #########################


//This URL will redirect to Google's accounts.google.com for Login, then redirect back to the frontend
export function OAuth_Redirect() {
  return fetch(ENDPOINT+"google-api/auth/start", {
})
  .then(response => response.json())
  .then(data => {
    
    console.log(data);
    // Store the new token

    //! This does nothing, just here in Case...
    const cookies = new Cookies();
    cookies.set('token', data.token);

    // Redirect the user to Google's consent screen
    console.log("Consent Screen:");
    window.location.href = data.authorization_url;
  });
}

export async function OAuthHandleCallback (code, courseDataId_List, callback) {

  const RESPONSE = await fetch(ENDPOINT + 'google-api/auth/callback', {
    method: 'POST' , 
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify({  "cdis": courseDataId_List, "code" : code}) 
    });
  
  let ResponseJSON = await RESPONSE.json();
  callback(ResponseJSON);
}