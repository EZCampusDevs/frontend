import React from 'react'

//Local stuff

import { CalendarPlaceholder } from '../../util/requests'
import { cParse2 } from '../../util/calendarJSON';
import NewCalendarEvent from './NewCalendarEvent';


const NewCalendar = ({calendarView, viewState, EARLIEST_TIME, LATEST_TIME}) => {

  const [eventsOverlay, setOverlay] = React.useState([<NewCalendarEvent colStart={2} timeStart="08:00:00" timeEnd="12:00:00"/>
  , <NewCalendarEvent colStart={3} timeStart="14:00:00" timeEnd="18:00:00"/>,
  <NewCalendarEvent colStart={4} timeStart="11:00:00" timeEnd="16:00:00"/>,
  <NewCalendarEvent colStart={4} timeStart="6:00:00" timeEnd="08:00:00"/>,
  <NewCalendarEvent colStart={5} timeStart="14:00:00" timeEnd="18:00:00"/>,
  <NewCalendarEvent colStart={6} timeStart="14:30:00" timeEnd="18:30:00"/>,
  <NewCalendarEvent colStart={7} timeStart="14:30:00" timeEnd="18:30:00"/>,
  <NewCalendarEvent colStart={8} timeStart="15:00:00" timeEnd="19:00:00"/>
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

          for (let i = EARLIEST_TIME; i < LATEST_TIME+CALENDAR_TOP_ROW_OFFSET; i++) {
            
          //Adding of Switch button:
 
          let titleBox_CSS_STR = "h-5 text-lg ml-20 w-24"
          let gridBox_CSS_STR = "h-5 border border-slate-400 col-span-1 col_w";
          
          gridBox_CSS_STR += " col-start-"+String(wI+1);
          titleBox_CSS_STR += " col-start-"+String(wI+1);
          
          //!If it's at the earliest column, let's use it for times:

          if(wI === 0 && depth >= CALENDAR_TOP_ROW_OFFSET){

            let normalized_i = i - CALENDAR_TOP_ROW_OFFSET;

            const hour = Math.floor(normalized_i / 2);
            const minutes = (normalized_i % 2) === 0 ? '00' : '30';
            const time = `${hour}:${minutes}`;
            
            bgCol.push(
              <div class={gridBox_CSS_STR+" text-center font-bold"}
              style = {{gridRowStart : (normalized_i+1), gridRowEnd : (normalized_i+2)}}> 
              {time}
              </div>);


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
                {weekdays[wI]}

              </span>);
          }
          else { //! Regular Background Cell

            bgCol.push(
              <div class={gridBox_CSS_STR}
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
        const colStart = dateObject.getDay()+2; //!

        jsxEvents.push(
          <NewCalendarEvent colStart={colStart} timeStart={timeStart} timeEnd={timeEnd}/>
        );


      }

      return jsxEvents;

    }

    //* ========== ========== ========== ========== ==========
    //* >> REACT useEffect & return
    //* ========== ========== ========== ========== ==========

    React.useEffect(() => { //OnMount
     }, []);

    React.useEffect(() => {

      //TODO: parse CalendarView
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