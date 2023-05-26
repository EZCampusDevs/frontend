import React from 'react'
import { useRef, useEffect } from 'react';


//Local imports:
import ENDPOINT from '../util/API';
import findCookie from '../util/findCookie';
import '../static/css/main_ui.css'

//Component imports:
import LogoutTemplate from '../components/state_template/LogoutTemplate';

const SignUp = () => {
    const usernameStr = useRef('');
    const passwordStr = useRef('');
    const nameStr = useRef('');
    const emailStr = useRef('');
    
    //New update user account edition
    const programStr = useRef(''); //Program of Study
    const yearInt = useRef(0);

    //This ref isn't used in the POST request:
    const passwordCopyStr = useRef('');

    const [auth, setAuth] = React.useState(-1);
    const [pwMatch, setPwM] = React.useState(false);
    const [status, setStatus] = React.useState('');


    //TODO: Change this to a dynamic request of programs
    const programs = [
        <option value={"ENG"}>Engineering</option> ,
        <option value={"COMPSCI"}>Computer Science</option>
    ]

    const checkPwMatch = () => {
        if(passwordStr.current.value === passwordCopyStr.current.value){
            setPwM(true)
        } else {setPwM(false)}
    }

    //Fetch requests:
    const signUpUser = async () => {
        
        const RESPONSE = await fetch(ENDPOINT + 'user/create', {
            method: 'POST' , 
            headers: {'Content-Type' : 'application/json'}, 
            body: JSON.stringify({
                "username": usernameStr.current.value,
                "password": passwordStr.current.value,
                "name": nameStr.current.value,
                "email": emailStr.current.value,
                "program" : programStr.current.value,
                "year_of_study" : yearInt.current.value
            })
        }
        
        );

        let respJSON = await RESPONSE.json();
        respJSON = respJSON.detail;

        if(RESPONSE.status !== 200){
            setStatus(<p className="error_message">{respJSON}</p>);
        } else {
            setStatus(<p style={{'color':'#4BB543'}}>{respJSON}</p>);

            //Wait 2 seconds and redirect
            window.setTimeout( ()=>{window.location.href = '/login'} , 2000 )

        }

    }


    //All Templates:

    //LOADING TEMPLATE
    const loading_tmpl = <div>Loading...</div>

    //AUTHED TEMPLATE:
    const authed_tmpl = <LogoutTemplate/>       

    //DENIED TEMPLATE: (our main one)
    const denied_tmpl = <div className="main_body">
        <div className="panel">
        <h2 className="panel_title">Sign Up to OTU Schedulizer</h2>
        <p className="panel_text">NOTE: You don't need to provide OTU specific credentials. Anything will do.</p>
    <br/>
        <span className="panel_text">Username:</span> <br/>
        <input type="text" placeholder="Username" ref={usernameStr}className="form-signin" /> <br/>

        <span className="panel_text">Password:</span><br/>
        <input type="password" placeholder="Password" ref={passwordStr} className="form-signin"/> <br/>

        <span className="panel_text">Re-enter Password:</span> <span>{(pwMatch) ? '✔️' : '❌'}</span><br/>
        <input type="password" placeholder="Re-enter Password" 
        ref={passwordCopyStr} className="form-signin"
        onChange={(e) => { checkPwMatch()}}/> <br/>
        
        <span className="panel_text">Name:</span><br/>
        <input type="text" placeholder="Name" ref={nameStr} className="form-signin" /> <br/>

        <span className="panel_text">Email:</span><br/>
        <input type="text" placeholder="Email" ref={emailStr}  className="form-signin" /> <br/>

        <span className="panel_text">Program:</span><br/>
        <select
            class="form-select form-select-box-shadow"
            // defaultValue={configs[0]}
            // onChange={e => {
            // passbackFunction(e.target.value)}}
        >
            {programs}
        </select>


        <span className="panel_text">Year of Study:</span><br/>
        <input type="number" placeholder="" ref={yearInt}  className="form-signin" /> <br/>

        <br/>
        <button className="btn btn-primary login_btn" onClick={signUpUser}>Sign Up</button>
        <div>{status}</div>
        </div>
       

    </div>


    //Check if user's auth cookies to see if he's logged in or not
    const cookieCheck = () => {

        if( findCookie('access_token', document.cookie) || findCookie('token_type', document.cookie) ){
            setAuth(1);
        } else {
            setAuth(0);
        }

    }

    //Main Routing (Checks for auths)
    const renderSignUpPage = (authState) => {

        if(authState === -1){return loading_tmpl;} //If -1, Loading Page
        else if (authState === 1){return authed_tmpl;} //If 1, Authed User, just redir
        else {return denied_tmpl;} //If 0 or anything else, Denied

    }


    useEffect(
        () => {
            cookieCheck()
        } , []
    )

  return (
    <div>
      {renderSignUpPage(auth)}
    </div>
  )
}

export default SignUp