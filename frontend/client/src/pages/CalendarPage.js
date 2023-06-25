import React, { useEffect } from 'react'

//Component imports
import PageHeader from '../components/navbar/PageHeader'
import Calendar from '../components/calendar/Calendar';

import CrnSettingPopUp from '../components/calendar/CrnSettingPopUp';

import LoadingTemplate from '../components/state_template/LoadingTemplate';

//Local/other file imports:
import ENDPOINT from '../util/API'
import {cParse, parseDescription} from '../util/calendarJSON'
import findCookie from '../util/findCookie';
import DeniedTemplate from '../components/state_template/DeniedTemplate';
import { logVoid } from '../util/logger';

import {crn_calendars, schedule_tag, subscribed_calendars, calendar_tags, app_name} from '../util/constant';


const CalendarPage = () => {

    //Document title:
    document.title = app_name + " | Calendar"


    //Event Listener for LocalStorage changes:

    window.addEventListener('storage', () => {
        window.location.reload();
    });

    //Authentication State:

    const [auth, setAuth] = React.useState(-1);

    //Calendar State:

    const [schedule, setSchedule] = React.useState([]);
    const [currentWeek, setCurWeek] = React.useState([0,7]);
    const [crnLinks, setCrnLinks] = React.useState([]);

    //New Pop Up:

    const [settingPayload, setSP] = React.useState(false);


    const [blobURL,setBlobURL] = React.useState('');

    //Scrolling thru the Calendar: (Updates to currentWeek State)

    const scrollForward = async () => {       
        if(currentWeek[1] < schedule.length-1){
          setCurWeek([currentWeek[0]+7,currentWeek[1]+7]);
        }
    }

    const scrollBackward = async () => {
      if(currentWeek[0] > 0){
        setCurWeek([currentWeek[0]-7,currentWeek[1]-7]);
      }  
    }

    //Calendar Settings (activate popup)

    const crnSettingsPopUp = () => {
        setSP(crnLinks);
    }

    const setICSdownload = async (type) => {
            logVoid('ICS Downloading... ')
            //Get Auth Cookie
            const token = findCookie('access_token', document.cookie);        
            
            const RESPONSE = await fetch(ENDPOINT + 'profile/download/'+type, {
                method: 'POST' , 
                headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token }
                }
            );
            
            if(RESPONSE.status === 200){
                //Creates HREF based on response File blob
                const href = window.URL.createObjectURL(await RESPONSE.blob());

                const link = document.createElement('a');
                link.href = href;
                link.download = "calendar.ics"

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // if(href){
                //     setBlobURL(href);
                // }
            }


    }

    //ACTUAL RENDERING IS DONE HERE:

    //LOADING TEMPLATE: (JSX Objects)
    const loading_tmpl = <>
        <PageHeader/>
        <LoadingTemplate/>

    </>

    //AUTHED TEMPLATE:
    const authed_tmpl = <>
            <PageHeader 
            slotOneJSX={<a className="header_text ht_spice" onClick={(e) => {crnSettingsPopUp()}}>CRN Settings</a>}
            // slotTwoJSX={<a className="header_text ht_spice" onClick={(e) => {setICSdownload("crn")}} download="crn_calendar.ics">
            //    Download CRN ICS
            //     </a>}
            slotTwoJSX={
                <a className="header_text ht_spice"  onClick={(e) => {}}>
                    Download CRN ICS
                </a>
            }
            slotThreeJSX={<a className="header_text ht_spice" onClick={(e) => {setICSdownload("calendar")}} download="club_calendar.ics">
            Download Club ICS
             </a>}
            />  
        <div>
        <br/>
        <div className="calendar_container" 
            tabIndex='0'   
            onKeyDown={(e) => 
            {
                if(e.code === 'ArrowRight' ) { scrollForward() } 
                if(e.code === 'ArrowLeft') { scrollBackward() }

            }}>
        
        <Calendar 
            current={[...schedule.slice(currentWeek[0],currentWeek[1])]} 
            crn_full={crnLinks} 
            personalized={true}
            scrollForward={scrollForward}
            scrollBackward={scrollBackward}
        /> 
        
        </div>
        
        <div className="cal_btn_container" >
        <button className= "cal_scroll_button" onClick={scrollBackward}>Previous Week</button>
        <button className="cal_scroll_button" onClick={scrollForward}>Next Week</button>
        </div>

        <br/>
    </div>
    </>

    //FIRST TIME AUTH: (2)
    const ft_authed_tmpl =<>
        <PageHeader/>
     <div className="bg_cont">
        Welcome to {app_name} <br/>

        <button className="btn btn-primary" onClick={(e) => {crnSettingsPopUp()}}>View Calendar Settings</button>    
    </div>

    </>


    //DENIED TEMPLATE:
    const denied_tmpl = <DeniedTemplate/>

    const renderCalendarPage = (authState) => {

        if(authState === -1){return loading_tmpl;} //If -1, Loading Page
        else if (authState === 1){return authed_tmpl;} //If 1, Authed User
        else if (authState === 2){return ft_authed_tmpl;} //If 1, Authed User without crns yet
        else {return denied_tmpl;} //If 0 or anything else, Denied

    }


    const generateCalendarTags = (obj) => {

        let dict = {}

        if( !Object.keys(obj).length){
            return dict;
        }

        for (const [i, club] of obj.entries()) {
            dict[club['uuid']] = club['calendar_tag'];
        }

        return dict;
    }

    const freshenSubbedCals = (newInput) => {
        
        console.log(window.localStorage.getItem(subscribed_calendars))

        //Sets it to the current subscribed_calendars wL state parsed, or an empty array

        let subscribedCalendars = window.localStorage.getItem(subscribed_calendars);

        if(!subscribedCalendars){
            subscribedCalendars = '[]';
        }

        subscribedCalendars = JSON.parse(subscribedCalendars);


        for(const itemInp of newInput){
            let loopBroke = 0;

            for(const [index,itemStore] of subscribedCalendars.entries()){
                if(itemStore.uuid === itemInp.uuid){
                    subscribedCalendars[index] = itemInp;
                    loopBroke += 1;
                    break;
                }
            }

            if(!loopBroke){
                subscribedCalendars.push(itemInp)
            }
        }

        return subscribedCalendars
    }

    const freshenCalTags = (newInput) => {
        
        //Sets it to the current 'subscribed_calendars' wL state parsed, or an empty array

        let calTags = window.localStorage.getItem(calendar_tags);

        if(!calTags){
            calTags = '[]';
        }

        calTags = JSON.parse(calTags);


        for(const itemInp of newInput){
            let loopBroke = 0;

            for(const [itemKey,itemValue] of Object.entries(calTags)){
                if(itemKey === itemInp.uuid){
                    calTags[itemKey] = itemInp.calendar_tag;
                    loopBroke += 1;
                    break;
                }
            }

            if(!loopBroke){
                calTags[itemInp.uuid] = itemInp.calendar_tag;
            }
        }

        return calTags
    }


    const getCalendar = async () => {

        //Get Auth Cookie
        const token = findCookie('access_token', document.cookie);        
        
        //Get scheduleTag from localStorage
        const scheduleTag = localStorage.getItem(schedule_tag) || "";

        //Get calendarTags from localStorage (for clubs)
        const calendarTags = JSON.parse(localStorage.getItem(calendar_tags) ) || {};

        let postBody = {
            "schedule_tag": scheduleTag,
            "calendar_tags": calendarTags
        }

        const RESPONSE = await fetch(ENDPOINT + 'profile/my/data', {
            method: 'POST' , 
            headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token }, 
            body: JSON.stringify(postBody)
            }
        );

        let respJSON = await RESPONSE.json();
        respJSON = respJSON.detail;
        

        if(RESPONSE.status === 401) {
            setAuth(0);
            return;
        }

        if(RESPONSE.status === 200){ //Recieved data:

            //Make sure the user has something to display
            
            // If Full is empty & there are no custom calendars to display
            if(!respJSON.full.length && !respJSON.subscribed_calendars.length){
                setAuth(2);//ok
                return
            }

            if(respJSON.schedule.length){

                //Reset the schedule & staleness tag in LS

                window.localStorage.setItem(crn_calendars , JSON.stringify(respJSON.schedule));
                window.localStorage.setItem(schedule_tag, respJSON.schedule_tag);  
            }

            if(respJSON.subscribed_calendars.length){

                window.localStorage.setItem(subscribed_calendars, JSON.stringify(
                    freshenSubbedCals(respJSON.subscribed_calendars ) ));

                // sortLScal(respJSON.subscribed_calendars);
                
                if(!window.localStorage.getItem(calendar_tags)){
        
                    window.localStorage.setItem(calendar_tags, JSON.stringify(
                        generateCalendarTags(respJSON.subscribed_calendars) ));

                } else {
                    window.localStorage.setItem(calendar_tags, JSON.stringify(
                        freshenCalTags(respJSON.subscribed_calendars ) ));
                }

            
                
            }

        }    


        const crn_cals = JSON.parse(window.localStorage.getItem(crn_calendars));
        const club_cals = JSON.parse(window.localStorage.getItem(subscribed_calendars));

        setSchedule(
            cParse(
                crn_cals, 
                club_cals
            )
        );

        // & Parses CRN Titles from crn_cals (JSON feedback of CRNs) and append them into respJSON.full as an extra entry 
        //TODO: Add the Semester string as an extra entry here

        logVoid('FULL RESPJSON');
        

        for(const entry of crn_cals){
            console.time("parsing...");

            const parsedCRN = parseInt( parseDescription(entry.description)["CRN"] );

            for(let k = 0; k < respJSON.full.length; k++){

                const entryCRN = parseInt(respJSON.full[k][1]);

                //Strict equality between 2 integers
                if(entryCRN === parsedCRN){
                    respJSON.full[k] = [ ...respJSON.full[k] , entry.title ];
                    break;
                }

            }

            console.timeEnd("parsing...");
        }


        setCrnLinks(respJSON.full);

        setAuth(1); //1 Indicates a logged in user.

    }

    //window.localStorage JUNK REMOVAL FUNCTION:
    const cleanJunk = () => {

        logVoid('Cleaning up JUNK !')

        //Any localStorage keys you'd like to disgard during component mount, enter  in array below:

        const blackList = ['cc_raw'];

        for (const key in window.localStorage) {

            
            if (window.localStorage.hasOwnProperty(key)) { //Filter's out window.localStorage built-in keys
                // key : key string
                // localStorage.getItem(key) : key value

                //Deletion of temp links
                if(key.slice(-9) === '_templink' || blackList.includes(key) ){ 
                    window.localStorage.removeItem(key);
                }
            }
        }
    }


    const RenderCalendarPage = () => {
        getCalendar();    
        cleanJunk();
    }

    useEffect(
        () => {
            RenderCalendarPage();
        } , []
    )

    //TODO: Find out why this is here; Update upon currentWeek change ?
    useEffect(
        () => {

        }, [currentWeek]
    )

  return (
    <div>  
        <div className="calendar_pg_body"> {/*Main container */}
        {renderCalendarPage(auth)}
        <CrnSettingPopUp trigger={settingPayload} setTrigger={setSP} reload={RenderCalendarPage}/>
        </div>
    </div>
  )
}

export default CalendarPage