import React from 'react';

//Local
import '../../static/css/main_ui.css';
import logo from "../../static/images/logo.png";
import findCookie from '../../util/findCookie';
import logout from '../../util/logout';

import PageHeaderPopUp from './PageHeaderPopUp';
import PageHeaderDropDown from './PageHeaderDropDown';
import PageHeaderDropDownSection from './PageHeaderDropDownSection';

//hooks

import useWindowDimensions from '../../util/hooks/useWindowDimensions';
import useScript from '../../util/hooks/useScript';

const PageHeader = ({ selectedElement, slotOneJSX, slotTwoJSX, slotThreeJSX }) => {

  //React State & Hooks

  const [isDropped, setDrop] = React.useState(false);
  const [ headerDropdown, setHeaderDropdown ] = React.useState(<></>);

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

  // ************* Header Sub Sections *************  
  
  const Tools = [
    <PageHeaderDropDownSection title={"ICS Download"} desc={"Download your calendar as .ics format!"} hrefProp="/ics"/>,
    <PageHeaderDropDownSection title={"Optimizer"} desc={"Get a personalized schedule in a matter of seconds!"} hrefProp="/optimizer"/>,
    <PageHeaderDropDownSection title={"Executive Planner"} desc={"This tool requires an elevated permission level..."} hrefProp="/executive"/>,
  //  <PageHeaderDropDownSection title={"Test #4th"} desc={"This tool requires an elevated permission level..."}/>
  ]

  const Events = [
    <PageHeaderDropDownSection title={"My Calendar"} desc={"Requires Auth"} hrefProp="/calendar"/>, 
    <PageHeaderDropDownSection title={"My Subscriptions"} desc={"Requires Auth"} hrefProp="/calendar"/>,
    <PageHeaderDropDownSection title={"Explore Events Corpus"} desc={"Requires Auth"} hrefProp="/calendar"/>,  
    <PageHeaderDropDownSection title={"Edit my Custom Calendars"} desc={"Requires Auth"} hrefProp="/calendar"/>, 
  ]

  // ^^^^^^^^^^^^^ Header Sub Sections ^^^^^^^^^^^^^


  const closeDropdown = () => {setHeaderDropdown(<></>);}  

  const HeaderDropdownBuilder = (content) => {
    setHeaderDropdown(<PageHeaderDropDown closeHook={closeDropdown} sections={content}/>)
  }
  



  const Desktop = () => {
    return (
      <>
      {headerDropdown}
      <div className="box_shadow header_container">
        <img src={logo} alt="ezcampus" width="50" height="50" className='logo_style'/>
          <a className="header_text" onClick={ () => {HeaderDropdownBuilder(Tools);} }>Tools</a> 
          <a className="header_text" onClick={ () => {HeaderDropdownBuilder(Events);} }>Events</a> 
          <span/> <span/>
          <div></div>
          {cookieCheck()}
      </div>
      </>
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