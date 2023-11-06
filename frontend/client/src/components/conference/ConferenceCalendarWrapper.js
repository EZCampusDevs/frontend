import React from 'react'

//React Components
import NewCalendar from '../calendar/NewCalendar.js';

//Local Utility
import { CalendarPlaceholder } from '../../util/requests';
import { cParse2 } from '../../util/calendarJSON';

//Redux 
import { useSelector, useDispatch } from 'react-redux';
import { leftScroll, rightScroll, setParameter } from '../../redux/features/newCalendarSlice.js';

const ConferenceCalendarWrapper = () => {
    
    //* ========== ========== ========== ========== ==========
    //* >> Constants for Wrapper
    //* ========== ========== ========== ========== ========== 

    const COURSE_MODE = false; //Events mode
  
    //* ========== ========== ========== ========== ==========
    //* >> REDUX DEFINITIONS & DISPATCHERS                             
    //* ========== ========== ========== ========== ==========

    const full_view = useSelector((state) => state.newCalendar.full_view);
    const current_offset = useSelector((state) => state.newCalendar.current_offset);
    const view_state = useSelector((state) => state.newCalendar.view_state);

    const dispatch = useDispatch();

    const reduxSetParameter = (parameterStr, payload) => { //& PARAMETER RE-ASSIGNMENT

        dispatch(setParameter({
            parameter : parameterStr,
            payload : payload
        }));

    }

    //Function Accepts a boolean Paramter, and size of scroll (N. Elements forward or back)
    const reduxScroll = (s, size) => { 
        if(s) { dispatch(rightScroll({scroll_size : size})); } 
        else {  dispatch(leftScroll({scroll_size : size}));  }
    }

    //React state
    const [width, setWidth] = React.useState(window.innerWidth);


    //* ========== ========== ========== ========== ==========
    //* >> API FUNCTIONS
    //* ========== ========== ========== ========== ==========    

    const handleAPIresponse = (response) => { //Once FastAPI Calendar comes in from CDIs
        
        // Handle the response data here
        console.log(response);
        let parsedCal = cParse2(response, COURSE_MODE); //*Calendar Parse, on Event Mode

        console.log("Before Serialization: ");
        console.log(parsedCal);

        const serializedParsedCal = JSON.parse(JSON.stringify(parsedCal)); //! Doing this Serializes the data, for Redux

        reduxSetParameter("full_view", serializedParsedCal); //Needs to be Seralized data
        reduxSetParameter("current_offset", 0); //Set Current view to start at beginning of list ( 0 )
    };

    //! FAKE SET COMMAND FOR DEVELOPPEMENT PURPOSES:
    // const setCalendarWithCDIs = (courseDataIds) => {
    //     handleAPIresponse({
    //       "status_code": 200,
    //       "detail": [
    //         {
    //           "location": "OT-North Oshawa SIRC 2010",
    //           "name": "Micropro. & Computer Architect (Laboratory)",
    //           "description": "ELEE3450U Micropro. & Computer Architect (Laboratory)\nCRN: 44194 | Section: 002\nInstructor: N/A\nDelivery: In-Person | Campus: OT-North Oshawa\n50 / 50 students enrolled",
    //           "seats_filled": 50,
    //           "max_capacity": 50,
    //           "is_virtual": false,
    //           "colour": "bg-blue-200",
    //           "time_start": "11:10:00",
    //           "time_end": "14:00:00",
    //           "rrulejs_str": "DTSTART;TZID=America/Toronto:20230906T111000\n"
    //         },
    //         {
    //           "location": "OT-North Oshawa SIRC 2010",
    //           "name": "Micropro. & Computer Architect (Laboratory)",
    //           "description": "ELEE3450U Micropro. & Computer Architect (Laboratory)\nCRN: 44194 | Section: 002\nInstructor: N/A\nDelivery: In-Person | Campus: OT-North Oshawa\n50 / 50 students enrolled",
    //           "seats_filled": 50,
    //           "max_capacity": 50,
    //           "is_virtual": false,
    //           "colour": "bg-purple-200",
    //           "time_start": "11:10:00",
    //           "time_end": "14:00:00",
    //           "rrulejs_str": "DTSTART;TZID=America/Toronto:20231004T111000\n"
    //         },
    //         {
    //           "location": "OT-North Oshawa SIRC 2010",
    //           "name": "Micropro. & Computer Architect (Laboratory)",
    //           "description": "ELEE3450U Micropro. & Computer Architect (Laboratory)\nCRN: 44194 | Section: 002\nInstructor: N/A\nDelivery: In-Person | Campus: OT-North Oshawa\n50 / 50 students enrolled",
    //           "seats_filled": 50,
    //           "max_capacity": 50,
    //           "is_virtual": false,
    //           "colour": "bg-cyan-200",
    //           "time_start": "11:10:00",
    //           "time_end": "14:00:00",
    //           "rrulejs_str": "DTSTART;TZID=America/Toronto:20231108T111000\n"
    //         },
    //         {
    //           "location": "OT-North Oshawa SIRC 2010",
    //           "name": "Micropro. & Computer Architect (Laboratory)",
    //           "description": "ELEE3450U Micropro. & Computer Architect (Laboratory)\nCRN: 44194 | Section: 002\nInstructor: N/A\nDelivery: In-Person | Campus: OT-North Oshawa\n50 / 50 students enrolled",
    //           "seats_filled": 50,
    //           "max_capacity": 50,
    //           "is_virtual": false,
    //           "colour": "bg-slate-200",
    //           "time_start": "11:10:00",
    //           "time_end": "14:00:00",
    //           "rrulejs_str": "DTSTART;TZID=America/Toronto:20231025T111000\n"
    //         },
    //         {
    //           "location": "OT-North Oshawa SIRC 2010",
    //           "name": "Micropro. & Computer Architect (Laboratory)",
    //           "description": "ELEE3450U Micropro. & Computer Architect (Laboratory)\nCRN: 44194 | Section: 002\nInstructor: N/A\nDelivery: In-Person | Campus: OT-North Oshawa\n50 / 50 students enrolled",
    //           "seats_filled": 50,
    //           "max_capacity": 50,
    //           "is_virtual": false,
    //           "colour": "bg-yellow-200",
    //           "time_start": "11:10:00",
    //           "time_end": "14:00:00",
    //           "rrulejs_str": "DTSTART;TZID=America/Toronto:20230920T111000\n"
    //         },
    //         {
    //           "location": "OT-North Oshawa SIRC 2010",
    //           "name": "Micropro. & Computer Architect (Laboratory)",
    //           "description": "ELEE3450U Micropro. & Computer Architect (Laboratory)\nCRN: 44194 | Section: 002\nInstructor: N/A\nDelivery: In-Person | Campus: OT-North Oshawa\n50 / 50 students enrolled",
    //           "seats_filled": 50,
    //           "max_capacity": 50,
    //           "is_virtual": false,
    //           "colour": "bg-red-200",
    //           "time_start": "11:10:00",
    //           "time_end": "14:00:00",
    //           "rrulejs_str": "DTSTART;TZID=America/Toronto:20231122T111000\n"
    //         },
    //         {
    //           "location": "OT-North Oshawa SIRC 1350",
    //           "name": "Micropro. & Computer Architect (Tutorial)",
    //           "description": "ELEE3450U Micropro. & Computer Architect (Tutorial)\nCRN: 45733 | Section: 013\nInstructor: N/A\nDelivery: In-Person | Campus: OT-North Oshawa\n49 / 50 students enrolled",
    //           "seats_filled": 49,
    //           "max_capacity": 50,
    //           "is_virtual": false,
    //           "colour": null,
    //           "time_start": "11:10:00",
    //           "time_end": "12:30:00",
    //           "rrulejs_str": "DTSTART;TZID=America/Toronto:20230907T111000;\nRRULE:FREQ=WEEKLY;UNTIL=20231204T123000;BYDAY=TH"
    //         },
    //         {
    //           "location": "OT-North Oshawa UA UA1350",
    //           "name": "Data Management Systems (Lecture)",
    //           "description": "SOFE3700U Data Management Systems (Lecture)\nCRN: 43511 | Section: 001\nInstructor: abdelhafeezkhalid (Khalid.Hafeez@ontariotechu.ca) N/A%\nDelivery: In-Person | Campus: OT-North Oshawa\n99 / 125 students enrolled",
    //           "seats_filled": 99,
    //           "max_capacity": 125,
    //           "is_virtual": false,
    //           "colour": null,
    //           "time_start": "18:40:00",
    //           "time_end": "20:00:00",
    //           "rrulejs_str": "DTSTART;TZID=America/Toronto:20230906T184000;\nRRULE:FREQ=WEEKLY;UNTIL=20231204T200000;BYDAY=WE,FR"
    //         },
    //         {
    //           "location": "OT-North Oshawa UA UA2120",
    //           "name": "Data Management Systems (Laboratory)",
    //           "description": "SOFE3700U Data Management Systems (Laboratory)\nCRN: 44213 | Section: 003\nInstructor: N/A\nDelivery: In-Person | Campus: OT-North Oshawa\n53 / 65 students enrolled",
    //           "seats_filled": 53,
    //           "max_capacity": 65,
    //           "is_virtual": false,
    //           "colour": "bg-green-300",
    //           "time_start": "10:10:00",
    //           "time_end": "12:00:00",
    //           "rrulejs_str": "DTSTART;TZID=America/Toronto:20230908T101000;\nRRULE:FREQ=WEEKLY;UNTIL=20231204T120000;BYDAY=FR"
    //         },
    //         {
    //           "location": "OT-North Oshawa SIRC 3110",
    //           "name": "Design & Analys. of Algorithms (Lecture)",
    //           "description": "SOFE3770U Design & Analys. of Algorithms (Lecture)\nCRN: 43513 | Section: 001\nInstructor: makrehchimasoud (Masoud.Makrehchi@ontariotechu.ca) N/A%\nDelivery: In-Person | Campus: OT-North Oshawa\n107 / 125 students enrolled",
    //           "seats_filled": 107,
    //           "max_capacity": 125,
    //           "is_virtual": false,
    //           "colour": "bg-cyan-200",
    //           "time_start": "15:40:00",
    //           "time_end": "17:00:00",
    //           "rrulejs_str": "DTSTART;TZID=America/Toronto:20230905T154000;\nRRULE:FREQ=WEEKLY;UNTIL=20231204T170000;BYDAY=TU,FR"
    //         },
    //         {
    //           "location": "OT-North Oshawa UA UA2140",
    //           "name": "Design & Analys. of Algorithms (Tutorial)",
    //           "description": "SOFE3770U Design & Analys. of Algorithms (Tutorial)\nCRN: 43514 | Section: 002\nInstructor: N/A\nDelivery: In-Person | Campus: OT-North Oshawa\n65 / 65 students enrolled",
    //           "seats_filled": 65,
    //           "max_capacity": 65,
    //           "is_virtual": false,
    //           "colour": "bg-red-200",
    //           "time_start": "12:40:00",
    //           "time_end": "14:00:00",
    //           "rrulejs_str": "DTSTART;TZID=America/Toronto:20230907T124000;\nRRULE:FREQ=WEEKLY;UNTIL=20231204T140000;BYDAY=TH"
    //         }
    //       ],
    //       "headers": null
    //     });
    // }

    const setCalendarWithStream = (stream) => {
        CalendarPlaceholder(stream, handleAPIresponse);
    }

    //* ========== ========== ========== ========== ==========
    //* >> REACT useEffect & return
    //* ========== ========== ========== ========== ========== 

    React.useEffect(() => {
        setCalendarWithStream("VPX");

     }, []);

     React.useEffect(() => {

        console.log(full_view);

     }, [full_view]);

     React.useEffect(() => {

        console.log(full_view.slice(current_offset, current_offset+7));

     }, [current_offset]);


//* ############### RESIZING OF WIDTH (onMount) ##############
React.useEffect(() => {
  // Function to update the width state
  const handleResize = () => { setWidth(window.innerWidth); };

  // Add event listener
  window.addEventListener('resize', handleResize);

  // Cleanup function to remove event listener when the component unmounts
  return () => {
      window.removeEventListener('resize', handleResize);
  };
}, []);



     // 30 * 48 = 1440, (1) 10 * 144 = 1440, (3) 
    
    const conferenceStreamButton  = (btn_name) => {
      return (
        <div className="w-1/3 p-2">
        <button type="button" className="btn btn-primary w-full">
        {btn_name}
        </button>
      </div>
      );
    }
    
    
    const viewportScaleCalendar = (width) => {

      //& Larger Viewport (Laptop / Desktop)
      if(width > 640) {

        return (
        <>

{/* DISALBED FOR CONFERENCE,. BUT IDEALLY IT'S THIS */}

{/* <div className="flex">
  <button className="large_warning_btn" onClick={() => {reduxScroll(false, 7)}}>Left {"<--"}</button>
  <button className="large_warning_btn" onClick={() => {reduxScroll(true, 7)}}>Right {"-->"}</button>
      </div> */}

          <NewCalendar 
          calendarView={full_view.slice(current_offset, current_offset+7)} 
          viewState={0}
          courseMode={COURSE_MODE}
          THIRTY_FRAC_DENOM={3}
          EARLIEST_TIME={36}
          LATEST_TIME={144}
          />

       </>
        );

      //& Mobile Viewport
      } else {
        return (
          <>
          
          
          <div className="flex space-x-4 justify-center">
            <button className="widget_btn" onClick={() => {reduxScroll(false, 1)}}>Left {"<--"}</button>
            <button className="widget_btn" onClick={() => {reduxScroll(true, 1)}}>Right {"-->"}</button>
          </div>
          
          <NewCalendar 
          calendarView={full_view.slice(current_offset, current_offset+1)} 
          viewState={2}
          courseMode={COURSE_MODE}
          THIRTY_FRAC_DENOM={3}
          EARLIEST_TIME={36}
          LATEST_TIME={144}
          />

          </>
        );
      }

    }

  //! MAIN RETURN STATEMENT:  
    return (<>
        <div className="flex justify-between">
        {conferenceStreamButton("Stream A")}
        {conferenceStreamButton("Stream B")}
        {conferenceStreamButton("Stream C")}
        </div>

        {viewportScaleCalendar(width)}
        </>);
}

export default ConferenceCalendarWrapper