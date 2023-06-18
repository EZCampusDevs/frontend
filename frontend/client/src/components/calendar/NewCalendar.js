import React from 'react'

//Local stuff

import { CalendarPlaceholder } from '../../util/requests'
import { cParse2 } from '../../util/calendarJSON';
import NewCalendarEvent from './NewCalendarEvent';

const NewCalendar = () => {

    //const eventsOverlay = [<NewCalendarEvent/>];
    
    
    // TODO: try to use rrule with it


    const generateCalendar = () => {


        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        let rows = [];

        const earliest = 0;
        const latest   = 48;


        //Generate Calendar Header
        let header = [];
        for(const [wI,wD] of weekdays.entries()) {
           let headerEntry = (<div className="text-center font-bold">
                        {weekdays[wI]}
                        </div>);

        rows.push(headerEntry);

        }


        let slotTimes = [];
        for (let i = earliest; i < latest; i++) {
            const hour = Math.floor(i / 2);
            const minutes = (i % 2) === 0 ? '00' : '30';
            const time = `${hour}:${minutes}`;
              
            const timeSlot = ( <div key={i} className="h-4 text-center col-start-1 col-span-1">
                    {time}
                  </div> );
            slotTimes.push(timeSlot); 
            

        }
        

        let cols = (
            <div className="grid grid-cols-8 gap-1">
              {/* TIME SLOTS (col 1) */}
              <div className="row-span-49 col-span-1">
                {/* SWITCH Button, TODO: add styling and functionality */}
                <span>Switch</span>
                {slotTimes}
              </div>
          
              {/* Starting from second column */}
              <div className="grid col-span-7 grid-cols-7 gr-50">

                <div className=" bg-blue-200 mt-6 h-16">01</div>
                <div className=" col-start-1
                bg-green-200 mt-20 h-20
                ">

                </div>


              </div>

            </div>
          );

        return cols;
    }


    const handleResponse = (response) => {
        // Handle the response data here
        console.log("Handling:");
        console.log(response);
        cParse2(response);
        
    };

    React.useEffect(() => {
        const courseDataIds = [1, 2, 3]; // Example array of course data IDs
        CalendarPlaceholder(courseDataIds, handleResponse);


     }, []);
    
  return (
    <div>
        
    {generateCalendar()}
    </div>
  )
}

export default NewCalendar