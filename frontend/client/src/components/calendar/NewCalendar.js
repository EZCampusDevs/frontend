import React from 'react'

//Local stuff

import { CalendarPlaceholder } from '../../util/requests'
import { cParse2 } from '../../util/calendarJSON';
import NewCalendarEvent from './NewCalendarEvent';
import { set } from 'lodash';

const NewCalendar = ({calendarView}) => {

  const [eventsOverlay, setOverlay] = React.useState([<NewCalendarEvent colStart={2} timeStart="08:00:00" timeEnd="12:00:00"/>
  , <NewCalendarEvent colStart={3} timeStart="14:00:00" timeEnd="18:00:00"/>,
  <NewCalendarEvent colStart={4} timeStart="11:00:00" timeEnd="13:00:00"/>,
  <NewCalendarEvent colStart={5} timeStart="14:00:00" timeEnd="18:00:00"/>,
  <NewCalendarEvent colStart={6} timeStart="14:30:00" timeEnd="18:30:00"/>,
  <NewCalendarEvent colStart={7} timeStart="14:30:00" timeEnd="18:30:00"/>,
  <NewCalendarEvent colStart={8} timeStart="15:00:00" timeEnd="19:00:00"/>
  ]);
    
  // 4, 5, 7, 8 doesn't WORK ???

    //* ========== ========== ========== ========== ==========
    //* >> Calendar JSX Rendering Function & Helpers
    //* ========== ========== ========== ========== ==========

    const generateCalendar = (view) => {

        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        const EARLIEST_TIME = 0;
        const LATEST_TIME   = 48;

        if(!view) { // If not view, assume it's the default 7 day

        }  

        let rows = [];

        //Generate Calendar Header
        let header = [];
        for(const [wI,wD] of weekdays.entries()) {
           let headerEntry = (<div className="text-center font-bold">
                        {wD}
                        </div>);

        rows.push(headerEntry);

        }

        const CALENDAR_TOP_ROW_OFFSET = 2;

        let bg = [];

        for (let wI = 0; wI <= weekdays.length; wI++) { // Start from 1 since you have a time column

          let bgCol = [];

          let depth = 0;

          for (let i = EARLIEST_TIME; i < LATEST_TIME+CALENDAR_TOP_ROW_OFFSET; i++) {
            
          //Adding of Switch button:
 

          let classStr = "h-5 border border-slate-400 col-span-1 ";
          classStr += "col-start-"+String(wI+1);

          //!If it's at the earliest column, let's use it for times:

          if(wI === 0 && depth >= CALENDAR_TOP_ROW_OFFSET){

            let normalized_i = i - CALENDAR_TOP_ROW_OFFSET;

            const hour = Math.floor(normalized_i / 2);
            const minutes = (normalized_i % 2) === 0 ? '00' : '30';
            const time = `${hour}:${minutes}`;
            
            bgCol.push(
              <div class={classStr+" text-center font-bold"}
              style = {{gridRowStart : (normalized_i+1), gridRowEnd : (normalized_i+2)}}> 
              {time}
              </div>);


          } else if(wI === 0 && depth === 0) {  //! Adding of Switch button:
            
            bgCol.push(
              <div class={classStr}
              style = {{
                gridRowStart : (i+1),
                gridRowEnd : (i+2)
              }}>
                SWITCH

              </div>);

          } else { //! Regular Background Cell

            bgCol.push(
              <div class={classStr}
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
            <div className="grid grid-cols-8 gap-1">

              {/* TIME SLOTS (col 1) */}
              {/* Starting from second column */}
              <div className="grid col-span-8 gr-50">
                {bg}
                {eventsOverlay}
                
              </div>

            </div>
          );

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

      console.log(jsxEvents);
      //setOverlay(jsxEvents);

    }, [calendarView]);

    //! RETURN STMT
    return (<div>  
      {generateCalendar()}
      </div>);

}

export default NewCalendar