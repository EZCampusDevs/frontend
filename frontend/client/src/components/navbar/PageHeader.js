import React from 'react';

//Local
import '../../static/css/main_ui.css';
import logo from "../../static/images/logo.png";
import findCookie from '../../util/findCookie';
import logout from '../../util/logout';

import PageHeaderPopUp from './PageHeaderPopUp';

//hooks

import useWindowDimensions from '../../util/hooks/useWindowDimensions';
import useScript from '../../util/hooks/useScript';

const PageHeader = ({ selectedElement, slotOneJSX, slotTwoJSX, slotThreeJSX }) => {

  const [isDropped, setDrop] = React.useState(false);
  const { height, width } = useWindowDimensions();

  //This value is an integer but should be thought about as pixels..
  const MOBILE_SWITCH = 1200 ;

  useScript("https://kit.fontawesome.com/a076d05399.js");

  // Login / Logout 
  const cookieCheck = () => {

    //Determine Auth state for template renderings:
      
/* Logged in*/ 
      if( findCookie('access_token', document.cookie) && findCookie('token_type', document.cookie) ){
          
          return (
          <div className="header_text">Welcome, You're logged in. 
            <button className="btn btn-warning ht_l_btn" onClick={()=>{logout();}}> Logout? </button>
          </div> );

      } else { /*Not logged in */
          
          return <div className="header_text">You're logged out, 
          <button
            className="btn btn-info ht_l_btn"
            onClick={() => {
            window.location.href = "/login";
          }}> Login? </button> </div>
      }

    }


  const Desktop = () => {
    return (
      <div className="box_shadow header_container">
        <img src={logo} alt="ezcampus" width="50" height="50" className='logo_style'/>
          <a className="header_text" href="/about/us">Our Team</a> 
          <a className="header_text" href='/executive'>Executive Planner</a> 
          <a className="header_text" href='/ics'>(.ics) Download Calendar</a>
          <a className="header_text" href='/optimize'>Optimizer</a>
          <div></div>
          {cookieCheck()}
      </div>
    )
  }

  const Mobile = () => {
    return (
      <div className="box_shadow mobile_header_container">
      
      <div>
        <img src={logo} alt="Logo" width="80" height="40" className='logo_style'/>
      </div>

      {/* <div onClick={() => {
        setDrop(!isDropped);
      }}>
      
      DROP ME

      </div> */}

      <div class="fas fa-bars mobile_drop_icon" 
            onClick={() => {
              setDrop(!isDropped);
            }}>
      </div>

      </div>
    )
  }

  const renderMobileDropDown = (state) => {

    if(state){
      return (
        <PageHeaderPopUp trigger={isDropped} setTrigger={setDrop} 
        slotList= { [slotOneJSX, slotTwoJSX, slotThreeJSX] }
        />
      )
    }
    
    return <></>

  }

  return (
    <>
    {(width > MOBILE_SWITCH ? Desktop() : Mobile())}
    { renderMobileDropDown(isDropped) }
    </>
  )
}

export default PageHeader