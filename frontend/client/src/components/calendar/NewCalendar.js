import React from "react";

//Local stuff

import { CalendarPlaceholder } from "../../util/requests";
import { logVoid } from "../../util/logger";

//JSX Helpers

import { OneDayView, SevenDayView } from "./calendarBuilder";

//React Components
import NewCalendarEvent from "./NewCalendarEvent";
import NewCalendarPopUp from "./NewCalendarPopUp";

const NewCalendar = ({
  calendarView,
  viewState,
  EARLIEST_TIME,
  LATEST_TIME,
  THIRTY_FRAC_DENOM,
}) => {
  //React JSX State

  const [popUp, setPopUp] = React.useState(<></>);



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

    let bg = []


    if (viewState === 0 || !viewState) {
      //! DEFAULT VIEW
      weekdays = ["Times", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
      gridSpan = 8;
      bg = SevenDayView(weekdays, EARLIEST_TIME, LATEST_TIME, CALENDAR_TOP_ROW_OFFSET, THIRTY_FRAC_DENOM, calendarView);
    } else if (viewState === 1) {
      //! 3 DAY VIEW
      weekdays = ["Times", "P.H", "P.H", "P.H"];
      gridSpan = 4;
    } else if (viewState === 2) {
      //! 1 DAY VIEW (mobile view)
      weekdays = ["Times", "Today's View"];
      gridSpan = 2;
      bg = OneDayView(weekdays, EARLIEST_TIME, LATEST_TIME, CALENDAR_TOP_ROW_OFFSET, THIRTY_FRAC_DENOM, calendarView);
    }


    let cols = (
      <div className={"grid grid-cols-" + gridSpan + " gap-1"}>
        {/* TIME SLOTS (col 1) */}
        {/* Starting from second column */}
        <div className={"grid col-span-" + gridSpan + " gr-50"}>
          {bg}
          {eventsOverlay}
        </div>
      </div>
    );

    return cols;
  };

  const encode_2_NewCalendarEvent = (viewEntry) => {
    const events = viewEntry.events;
    const dateObject = new Date(viewEntry.date);

    console.log(dateObject.getDay());

    let jsxEvents = [];

    for (const event of events) {
      console.log(event);

      const timeStart = event["time_start"];
      const timeEnd = event["time_end"];
      
      const color = event["colour"];

      const colStart = dateObject.getDay() + 1; //!

      jsxEvents.push(
        <NewCalendarEvent
          viewState={viewState}
          color={color}
          onClickCallback={PopUpCallback}
          eventBlob={event}
          colStart={colStart}
          timeStart={timeStart}
          timeEnd={timeEnd}

          EARLIEST_INTR={EARLIEST_TIME}
          DENOM_FACTOR={THIRTY_FRAC_DENOM}
        />
      );
    }

    return jsxEvents;
  };

  //* ========== ========== ========== ========== ==========
  //* >> REACT useEffect & return
  //* ========== ========== ========== ========== ==========

  const PopUpCallback = (eventBlob) => {
    setPopUp(
      <NewCalendarPopUp onClose={() => setPopUp(null)} 
                      event={eventBlob} />
    );
  };

  
  //! Uncomment once placholder events is fixed
  React.useEffect(() => {
    //TODO: parse CalendarView
    logVoid("CALENDAR VIEW *** : ");
    console.log(calendarView);

    let jsxEvents = [];

    for (const viewEntry of calendarView) {
      let miniJSX = encode_2_NewCalendarEvent(viewEntry);
      if (miniJSX.length) {
        for (const m of miniJSX) {
          jsxEvents.push(m);
        }
      }
    }

    setOverlay(jsxEvents);
  }, [calendarView]);


  // RETURN STMT
  return (
    <div>
      {popUp}
      {generateCalendar()}
    </div>
  );
};

export default NewCalendar;
