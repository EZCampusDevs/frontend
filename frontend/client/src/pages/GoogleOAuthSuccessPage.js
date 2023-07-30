import React from 'react'
import Cookies from 'universal-cookie';
import { OAuthHandleCallback } from '../util/requests';
import PageHeader from '../components/navbar/PageHeader';

const GoogleOAuthSuccessPage = () => {
  
  const [view, setView] = React.useState(0);

  const SuccessCallback = (json) => {
    console.log("SUCCESS: " + JSON.stringify(json));
    //TODO: do something with JSON

    window.location.search = "?completed=1";

  }

  function renderSwitch(state) {
    if(!state) {
      return (<><br/>
      <span className="sub_title">Requesting Google's Calendar API...</span>
      </>);
    } if (state === 1) {
      return (<><br/>
      <span className="step_title">Success!</span>
      <br/>
      <span className="sub_title">Added your Selection to your Google Calendar, go check it out.</span>
      <br/>
      <a href="https://calendar.google.com/">https://calendar.google.com/</a></>);

    } else { //! Error state
      return(
        <>
              <span className="sub_title">ERROR</span>
        </>
      )
    }
  }

  React.useEffect(() => {
    setView(0);
    let URLSearch = window.location.search;


    //! ASSERT FOR IF It's a Success Redirect:
    if(URLSearch === "?completed=1") {
      setView(1);
      return;
    }

    console.log(">> Mounted with URL Location:");
    console.log(window.location);
    //This are the given URL parameters in request http://localhost:8000/g?f=1
    //The search here is `?f=1`

    const searchParams = new URLSearchParams(URLSearch); 

    const googleAccessCode = searchParams.get('code'); //Code sent back to google for Validating FLOW Credentials

    //Assert for CDIs, if exists make rq
    const cookies = new Cookies();
    let encoded_CDI_cookie = cookies.get('course_data_ids');

    //Cookies get URL Encoded, and since JSON contains some weird characters, stuff breaks
    //* Example: `%5B2817%2C2818%5D` -> `[2817, 2818]`

    if(encoded_CDI_cookie) {

    const decoded = decodeURIComponent(encoded_CDI_cookie); //Returns some like 123,456
    const ld = '['+decoded+']'; //Adds the brackets and makes it valid json
    const array = JSON.parse(ld);

    OAuthHandleCallback(googleAccessCode, array, SuccessCallback);
    cookies.remove('course_data_ids');
    }
  }, []); //& ON MOUNT

  return (
    <>
    <PageHeader/>
    {renderSwitch(view)}
    </>
  )
}

export default GoogleOAuthSuccessPage