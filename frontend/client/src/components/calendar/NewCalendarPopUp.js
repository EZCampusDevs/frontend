import React from 'react'

//Component Imports:

import PopUpWrapper from '../util/PopUpWrapper'

const NewCalendarPopUp = ({onClose, event, courseMode}) => {

//* courseCode: True is Courses, False is Events

const eventDesc = event["description"];

const DescriptionRenderer = (courseMode) => {
    
    if(courseMode){
        return(
            <>

            <p className="font-semibold">Seats Filled:</p>
              <p>{event["seats_filled"]}</p>

            <p className="font-semibold">Campus:</p>
            <p>{eventDesc["campus"]}</p>

            <p className="font-semibold">Delivery:</p>
            <p>{eventDesc["delivery"]}</p>

            <p className="font-semibold">CRN:</p>
            <p>{eventDesc["crn"]}</p>

            <p className="font-semibold">Section:</p>
            <p>{eventDesc["section"]}</p>
            </>
        );
    } else {
        return(<>
            <p className="font-semibold">Event Description:</p>
            <p>{eventDesc}</p>
        </>)
    }
}

//!BAD DESIGN ? : OnClose is Prop Drilled
    return (
      <PopUpWrapper onClose={() => { onClose(); console.log(event); }}>
      <div className="flex flex-col items-center space-y-4">
          {/* Mock Icon */}
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">MC</span>
          </div>

          <h3 className="main_pop_title text-2xl mb-4">{event["name"]}</h3>

          <div className="w-full grid grid-cols-2 gap-4">
              <p className="font-semibold">Time Start:</p>
              <p>{event["time_start"]}</p>

              <p className="font-semibold">Time End:</p>
              <p>{event["time_end"]}</p>

              <p className="font-semibold">Location</p>
              <p>{event["location"]}</p>

                {/* COURSE DESCRIPTION BREAKDOWN: */}

                {DescriptionRenderer(courseMode)}
          </div>
      </div>
  </PopUpWrapper>
  );
}

export default NewCalendarPopUp