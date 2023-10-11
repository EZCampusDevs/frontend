import React from 'react'

//Component Imports:

import PopUpWrapper from '../util/PopUpWrapper'

const NewCalendarPopUp = ({onClose, event}) => {


//!BAD DESIGN ? : OnClose is Prop Drilled
    return (
        <PopUpWrapper onClose={() => {onClose(); console.log(event);}}> 
              <h3 className="main_pop_title">{event["name"]}</h3>
        </PopUpWrapper>
  );
}

export default NewCalendarPopUp