import React from 'react'
import { useEffect } from 'react';

//Local File imports
import ENDPOINT from '../util/API';
import findCookie from '../util/findCookie';
import '../static/css/home.css';
import { InitRequest } from '../util/requests';
import { app_name } from '../util/constant';

//Component imports:
import RenderWall from '../components/util/RenderWall';
import LoadingTemplate from '../components/state_template/LoadingTemplate';

const HomePage = () => {

  const [auth,setAuth] = React.useState(-1);

  const Initialize = async () => {
    setAuth(await InitRequest());
  }

  const guest_tmpl = <>
  <a href="/login" className="home_option btn btn-primary btn-lg btn-block">Login to Enter</a> <br/><br/>
  <a href="/about" className="home_option btn btn-primary btn-lg btn-block">About Us</a>


  </>

  const authed_tmpl = <>
  <a href="/calendar" className="home_option btn btn-primary btn-lg btn-block">Enter App</a> <br/><br/>
  <a href="/about" className="home_option btn btn-primary btn-lg btn-block">About Us</a>
  </>

  const custom_load = <>
   <p className="home_slogan">Loading . . .</p> 
  </>


  useEffect(() => {
    Initialize();

  }, []);

  return <div className="home_body">
    <div className="home_title">Welcome to {app_name}</div>
    <p className="home_slogan">Built for OTU students, by OTU students.</p>
    <RenderWall auth={auth} deniedTemplate={guest_tmpl} loadingTemplate={custom_load} authedTemplate={authed_tmpl}/>
  </div>
}

export default HomePage