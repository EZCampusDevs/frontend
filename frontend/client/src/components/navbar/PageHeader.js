import React from 'react';

//Local
import '../../static/css/main_ui.css';
import logo from "../../static/images/logo.png";
import findCookie from '../../util/findCookie';
import { logout } from '../../util/browserUtil';

import PageHeaderDropDown from './PageHeaderDropDown';
import PageHeaderDropDownSection from './PageHeaderDropDownSection';

//hooks

import useWindowDimensions from '../../util/hooks/useWindowDimensions';
import useScript from '../../util/hooks/useScript';

const PageHeader = ({ selectedElement, slotOneJSX, slotTwoJSX, slotThreeJSX, hideDropDownButtons }) => {

  //React State & Hooks

  const [isDropped, setDrop] = React.useState(false);
  const [headerDropdown, setHeaderDropdown] = React.useState(<></>);

  //SVGS

  const moonSVG = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>

  const sunSVG = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>



  //Icon States:
  const [darkModeIcon, setDarkModeIcon] = React.useState(moonSVG);



  const { height, width } = useWindowDimensions();

  //This value is an integer but should be thought about as pixels..
  const MOBILE_SWITCH = 576;

  // Login / Logout 
  const cookieCheck = () => {

    //Determine Auth state for template renderings:

    /* Logged in*/
    if (findCookie('access_token', document.cookie) && findCookie('token_type', document.cookie)) {

      //do
    } else { /*Not logged in */

      //else
    }

  }

  // ************* Header Sub Sections *************  

  const Tools = [
    <PageHeaderDropDownSection title={"ICS Download"} desc={"Download your calendar as .ics format!"} hrefProp="/ics" />,
    <PageHeaderDropDownSection title={"Optimizer"} desc={"Get a personalized schedule in a matter of seconds!"} hrefProp="/optimizer" />,
    <PageHeaderDropDownSection title={"Executive Planner"} desc={"This tool requires an elevated permission level..."} hrefProp="/executive" />,
    //  <PageHeaderDropDownSection title={"Test #4th"} desc={"This tool requires an elevated permission level..."}/>
  ]

  const Events = [
    <PageHeaderDropDownSection title={"My Calendar"} desc={"Requires Auth"} hrefProp="/calendar" />,
    <PageHeaderDropDownSection title={"My Subscriptions"} desc={"Requires Auth"} hrefProp="/calendar" />,
    <PageHeaderDropDownSection title={"Explore Events Corpus"} desc={"Requires Auth"} hrefProp="/calendar" />,
    <PageHeaderDropDownSection title={"Edit my Custom Calendars"} desc={"Requires Auth"} hrefProp="/calendar" />,
  ]

  // ^^^^^^^^^^^^^ Header Sub Sections ^^^^^^^^^^^^^


  const closeDropdown = () => { setHeaderDropdown(<></>); }

  const HeaderDropdownBuilder = (content) => {
    setHeaderDropdown(<PageHeaderDropDown closeHook={closeDropdown} sections={content} />)
  }


  //! Feature: Dark Mode Toggle

  const setDarkHTML = () => {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = 'rgb(17,24,39)';
    setDarkModeIcon(sunSVG);
  }

  const setLightHTML = () => {
    document.documentElement.classList.remove('dark');
    document.body.style.backgroundColor = 'rgb(222,243,255)';
    setDarkModeIcon(moonSVG)
  }


  const toggleDarkMode = () => {
    // Step 1: Check if 'theme' exists in localStorage
    if (!localStorage.getItem('theme')) {
      // If 'theme' doesn't exist, create it and set the value to 'light'
      localStorage.setItem('theme', 'light');
    }

    // Step 2: Toggle between 'light' and 'dark' themes
    const currentTheme = localStorage.getItem('theme');
    const updatedTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', updatedTheme);


    
    // Step 3: Add or remove the 'dark' class based on the updated theme
    if (updatedTheme === 'dark') { setDarkHTML(); } 
    else { setLightHTML(); }
  }

  const setTheme = () => {
    let currentTheme = localStorage.getItem('theme');
        
    if (!currentTheme) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // System prefers dark theme
        localStorage.setItem('theme', 'dark');
      } else {
        // System prefers light theme
        localStorage.setItem('theme', 'light');
      }
    }

    currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') { setDarkHTML(); } 
    else { setLightHTML(); }

  }

  React.useEffect(() => {
    setTheme();
  }, [])

  return (
    <>
      {headerDropdown}
      <header className="w-full p-4 h-20 bg-custom-dark-blue text-left header_container box_shadow flex items-center">
        <a href='institutions' className="flex items-center">
          <img src={logo} alt="ezcampus" className='logo_style object-contain h-12 max-w-full' />
        </a>
    
        {!hideDropDownButtons && <a className="header_text" onClick={() => { HeaderDropdownBuilder(Tools); }} style={{ cursor: 'pointer' }}>Tools</a>}
        {!hideDropDownButtons && <a className="header_text" onClick={() => { HeaderDropdownBuilder(Events); }} style={{ cursor: 'pointer' }}>Events</a>}
        <span className="flex-1" /> 
        <div className="pl-10 flex">

          {/* LOGIN ICON */}
          <a href='/login'>
            <svg className="w-9 h-9 text-indigo-50 ml-10 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </svg>
          </a>


          {/* DARKMODE ICON */}
          <svg className="w-9 h-9 ml-5 text-indigo-50 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" onClick={() => { toggleDarkMode() }}>
            {darkModeIcon}
          </svg>

        </div>
      </header>
    </>
  );
}

export default PageHeader