import React from 'react'

//Local stuff

import { CalendarPlaceholder } from '../../util/requests'
import { cParse2 } from '../../util/calendarJSON';
import NewCalendarEvent from './NewCalendarEvent';
import { logVoid } from '../../util/logger';


const NewCalendar = ({calendarView, viewState, EARLIEST_TIME, LATEST_TIME, THIRTY_FRAC_DENOM}) => {
  
  //chatgpt : #### WROTE THIS FORMATTING HELPER FN:
      function formatDateToCalendarView(dateString) {
        const dateObj = new Date(dateString);
        dateObj.setDate(dateObj.getDate() - 2); //! HARD CODE, this is a problem
        // Array of month names
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Get the month name from the date
        const monthName = monthNames[dateObj.getMonth()];

        // Get the day from the date
        const day = dateObj.getDate();

        // Get the ordinal suffix for the day
        let ordinalSuffix;
        if (day % 10 === 1 && day !== 11) {
            ordinalSuffix = "st";
        } else if (day % 10 === 2 && day !== 12) {
            ordinalSuffix = "nd";
        } else if (day % 10 === 3 && day !== 13) {
            ordinalSuffix = "rd";
        } else {
            ordinalSuffix = "th";
        }

        return `${monthName} ${day}${ordinalSuffix}`;
    }

  const [eventsOverlay, setOverlay] = React.useState([
  // <NewCalendarEvent colStart={2} timeStart="10:00:00" timeEnd="12:30:00" EARLIEST_INTR={EARLIEST_TIME} LATEST_TIME={LATEST_TIME} DENOM_FACTOR={THIRTY_FRAC_DENOM} />,
  ]);
    
    //* ========== ========== ========== ========== ==========
    //* >> Calendar JSX Rendering Function & Helpers
    //* ========== ========== ========== ========== ==========

    const generateCalendar = () => {

        //Constants
        const CALENDAR_TOP_ROW_OFFSET = 1;

        //Mutables
        let gridSpan;
        let weekdays;

        if(viewState === 0 || !viewState) { //! DEFAULT VIEW
          weekdays = ['Times', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
          gridSpan = 8;

        } else if (viewState === 1) { //! 3 DAY VIEW
          weekdays = [ 'Times' , "P.H" , 'P.H' , "P.H"];
          gridSpan = 4;

        } else if (viewState === 2) { //! 1 DAY VIEW (mobile view)
          weekdays = [ 'Times' , "P.H"]; 
          gridSpan = 2;
        }



        let bg = [];

        for (let wI = 0; wI <= weekdays.length-1; wI++) { // Start from 1 since you have a time column

          let bgCol = [];
          let depth = 0;

          let timeCounter = 0;

          for (let i = EARLIEST_TIME; i < LATEST_TIME+CALENDAR_TOP_ROW_OFFSET; i++) {
            
          //Adding of Switch button:
 
          let titleBox_CSS_STR = "h-5 text-lg ml-20 w-24 night_text"
          let gridBox_CSS_STR = "h-2 border border-slate-400 col-span-1 col_w";
          let gridBoxT_CSS_STR = "h-2 col-span-1 col_w border-b-2 border-x-2 border-slate-300";

          
          gridBox_CSS_STR += " col-start-"+String(wI+1);
          titleBox_CSS_STR += " col-start-"+String(wI+1);

        //Line Border Every 3 Lines (Right Before next Time Stamp)
        let isLineBorder = (timeCounter === 1) ? gridBoxT_CSS_STR : gridBox_CSS_STR;

        //!If it's at the earliest column, let's use it for times:
        if(wI === 0 && depth >= CALENDAR_TOP_ROW_OFFSET){

          let normalized_i = i - CALENDAR_TOP_ROW_OFFSET;

          const hour = Math.floor(normalized_i / 6); // Adjusted for 10-min intervals
          const minutes = (normalized_i % 6) === 0 ? '00' : '30'; // Adjusted for 10-min intervals
          const time = `${hour}:${minutes}`;
          
          if(!timeCounter) {
          bgCol.push(
              <div class={gridBox_CSS_STR + " text-center font-bold"}
              style = {{
                  gridRowStart: (normalized_i+1),
                  gridRowEnd: (normalized_i+4), // Span 3 rows
              }}>
              {time}
              </div>
          );
          timeCounter += 2;
        } else {

          bgCol.push(
            <div class={isLineBorder + " text-center font-bold"}
            style = {{
                gridRowStart: (normalized_i+1),
                gridRowEnd: (normalized_i+2), // Span 3 rows
            }}>
            </div>
        );
          timeCounter--
        }

            
      } else if (depth === 0) { //! Adding DAYs OF THE WEEK

            let w = "100vw";

            bgCol.push(
              <span class={titleBox_CSS_STR}
              style = {{
                gridRowStart : (i+1),
                gridRowEnd : (i+2),
                textAlign : 'center',
                height : "3.5vh",
                width : w,
              }}>

                {wI === 0 ? "" : (calendarView[wI-1] ? formatDateToCalendarView(calendarView[wI-1].date) : "" )}<br/>
                {weekdays[wI]}

              </span>);
          }
          else { //! Regular Background Cell

            const moduloClass = (i % THIRTY_FRAC_DENOM === 0) ? gridBoxT_CSS_STR : gridBox_CSS_STR;
            
            bgCol.push(
              <div class={moduloClass}
              style = {{
                gridRowStart : (i+1),
                gridRowEnd : (i+2)
              }}></div>);
          }

          depth++; //To Maintain the Header's spacing
          }

          bg.push(<div
          style= {{ gridRowStart : 1}}>
            {bgCol}
          </div>);
        }
        

        let cols = (
            <div className={"grid grid-cols-"+gridSpan+" gap-1"}>

              {/* TIME SLOTS (col 1) */}
              {/* Starting from second column */}
              <div className={"grid col-span-"+gridSpan+" gr-50"}>
                {bg}
                {eventsOverlay}
                
              </div>

            </div>);

        return cols;
    }

    const encode_2_NewCalendarEvent = (viewEntry) => {
      
      const events = viewEntry.events;
      const dateObject   = new Date(viewEntry.date);
       
      console.log(dateObject.getDay());
      

      let jsxEvents = [];

      for(const event of events){

        console.log(event);

        const timeStart = event["time_start"];
        const timeEnd = event["time_end"];
        const colStart = dateObject.getDay()+1; //!

        jsxEvents.push(
        <NewCalendarEvent 

            eventBlob={event}

            colStart={colStart} 
            timeStart={timeStart} 
            timeEnd={timeEnd}  
            
            EARLIEST_INTR={EARLIEST_TIME} 
            LATEST_TIME={LATEST_TIME} 
            DENOM_FACTOR={THIRTY_FRAC_DENOM}
        />);
      }

      return jsxEvents;
    }

    //* ========== ========== ========== ========== ==========
    //* >> REACT useEffect & return
    //* ========== ========== ========== ========== ==========

    React.useEffect(() => { //OnMount
     }, []);

  //! Uncomment once placholder events is fixed   
    React.useEffect(() => {

      //TODO: parse CalendarView
      logVoid("CALENDAR VIEW *** : ")
      console.log(calendarView);

      let jsxEvents = [];

      for(const viewEntry of calendarView) {
        let miniJSX = encode_2_NewCalendarEvent(viewEntry);
        if(miniJSX.length){
          for(const m of miniJSX){ 
            jsxEvents.push(m);
          }
        }
      }

      setOverlay(jsxEvents);

    }, [calendarView]);

    //! RETURN STMT
    return (<div>  
      {generateCalendar()}
      </div>);

}

export default NewCalendar