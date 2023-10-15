import React from 'react'

//Component Imports:

import PopUpWrapper from '../util/PopUpWrapper'

const NewCalendarPopUp = ({onClose, event}) => {

const eventDesc = event["description"];


//!BAD DESIGN ? : OnClose is Prop Drilled
    return (
        <PopUpWrapper onClose={() => {onClose(); console.log(event);}}> 
              <h3 className="main_pop_title">{event["name"]}</h3>
              {event["time_start"]} <br/>
              {event["time_end"]} <br/>

              <br/><br/>
              {event["seats_filled"]} <br/> 
              <br/><br/>
              {eventDesc["campus"]}<br/>

            {eventDesc["delivery"]}<br/>

            {eventDesc["crn"]}<br/>
            {eventDesc["section"]}


        </PopUpWrapper>
  );
}

export default NewCalendarPopUp