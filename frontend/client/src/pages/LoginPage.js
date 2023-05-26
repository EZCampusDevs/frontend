import React from 'react'
import { useRef, useEffect } from 'react';
import Cookies from 'universal-cookie';

//Local File imports
import ENDPOINT from '../util/API';
import '../static/css/main_ui.css';
import {app_name} from '../util/constant';
import { cookieAuthCheck } from '../util/browserUtil';

//Components
import LogoutTemplate from '../components/state_template/LogoutTemplate';

const LoginPage = () => {

  const cookies = new Cookies();

  //State:
  const [errorMsg, setErrorMsg] = React.useState('');
  const [auth, setAuth] = React.useState(-1);

  //Ref strings:
  const usernameStr = useRef('');
  const passwordStr = useRef('');  
  
  //Login Function (Request)
  const loginUser = async (event) => {
    
    event.preventDefault()

    if(!usernameStr.current.value || !passwordStr.current.value){
      setErrorMsg('Some fields are missing information!');
      return;
    }

    const RESPONSE = await fetch(ENDPOINT + 'user/login', 

    //Request Params
    {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded' //*This is what type FastAPI Login Manager wants as `Content-Type` header
      }, //* Curl inspired POST request for login
      body: JSON.stringify(
        `grant_type=&username=${usernameStr.current.value}&password=${passwordStr.current.value}&scope=&client_id=&client_secret=`
      ),
    })
    

    //! RESPONSE DESIGN PATTERN STRAYS FROM THE REST...
    
    const respJSON = await RESPONSE.json(); //didn't unwrap detail here

    if(RESPONSE.status === 200) {
      cookies.set('access_token' , respJSON.detail.access_token);
      cookies.set('token_type' , respJSON.detail.token_type);

      window.location.href = "/executive";
    } else {
      setErrorMsg(respJSON.detail);
      return;

    }
  }  

  //Views:
  
  const loading_tmpl = <div>Loading...</div>

  const authed_tmpl = <LogoutTemplate/>

  //This is a function since it needs a param passed in
  const denied_tmpl = (<div className="main_body">

  <div className="login_panel box_shadow"> 

    <h2 className="panel_title">{app_name}</h2>
    <p className="login_panel_text">Built for OTU students, by OTU students.</p>

  <form className="form-signin" onSubmit={loginUser}>
  <input className="form-control" style={{'margin-bottom': '0.5vh'}} type="text"     
      id="login-user" 
      placeholder="Username or Email"
      required=''
      maxLength='255'
      minLength='3'
      ref={usernameStr}>
  </input>

  <input className="form-control" type="password"     
      id="login-pass" 
      placeholder="Password"
      required=''
      maxLength='50'
      minLength='4'
      ref={passwordStr}>
  </input>
  <br/>
  <input className="login_btn btn btn-primary" type="submit" value="Log In"/>
</form>
<div className="error_message">{errorMsg}</div>

  </div>

{/* This is the secondary panel (Redirect to signup) */}
<div className="panel_secondary box_shadow">
  <p className="panel_text">Don't have an account?</p>
  <button className="btn btn-info su_btn" onClick={() => {window.location.href = '/signup'}}>Sign Up</button>
</div>

</div>);
   
   
  //!View switching function:

  const renderLoginPage = (authState) => {

    if(authState === -1){return loading_tmpl;} //If -1, Loading Page
    else if (authState === 1){return authed_tmpl;} //If 1, Authed User, just redir
    else {return denied_tmpl;} //If 0 or anything else, Denied

    }

    useEffect( //Upon mount, set the Auth state given the cookies (used above) to render appropriate view  
        () => {
        setAuth(cookieAuthCheck(document.cookie, true));
        } , []
    )

  return (<div> {renderLoginPage(auth)} </div>);
}

export default LoginPage