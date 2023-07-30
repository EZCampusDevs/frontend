import React from 'react'
import Cookies from 'universal-cookie';
import { OAuthHandleCallback } from '../util/requests';

const GoogleOAuthSuccessPage = () => {
  
  
  
  React.useEffect(() => {
    
    console.log(">> Mounted with URL Location:");
    console.log(window.location);
    //This are the given URL parameters in request http://localhost:8000/g?f=1
    //The search here is `?f=1`

    const searchParams = new URLSearchParams(window.location.search); 

    const googleAccessCode = searchParams.get('code'); //Code sent back to google for Validating FLOW Credentials

    //Assert for CDIs, if exists make rq
    const cookies = new Cookies();
    let encoded_CDI_cookie = cookies.get('course_data_ids');

    //Cookies get URL Encoded, and since JSON some weird character, stuff breaks
    //* Example: `%5B2817%2C2818%5D` -> `[2817, 2818]`

    if(encoded_CDI_cookie) {

    const decoded = decodeURIComponent(encoded_CDI_cookie); //Returns some like 123,456
    const ld = '['+decoded+']'; //Adds the brackets and makes it valid json
    const array = JSON.parse(ld);

    OAuthHandleCallback(googleAccessCode, array);
    cookies.remove('course_data_ids');
    }

  }, [])

  return (
    <>
    Successfully added !
    
    </>
  )
}

export default GoogleOAuthSuccessPage