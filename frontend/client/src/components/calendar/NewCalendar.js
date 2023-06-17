import React from 'react'

//Local stuff

import { CalendarPlaceholder } from '../../util/requests'
import { cParse2 } from '../../util/calendarJSON';

const NewCalendar = () => {

    // TODO: try to use rrule with it

    const generateCalendar = () => {
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        let headers = [];

        const timeslots = 48;


        //Generate Calendar Header

        for(const [wI,wD] of weekdays.entries()) {
           let Header = (<div className="text-center font-bold">
                        {weekdays[wI]}
                        </div>);
            headers.push(Header);
        }



        let cols = <div className="grid grid-cols-7 gap-2">
            {headers}
        </div>

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