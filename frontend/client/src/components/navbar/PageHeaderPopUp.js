import React from 'react'
import PopUpPadding from '../util/PopUpPadding';
import {app_name} from '../../util/constant';

const PageHeaderPopUp = ({trigger, setTrigger, slotList }) => {

  const closePopUp = () => {
    setTrigger(false); 
  }

  const genSettings = (slots) => {

    //Assume that if the first array elm is null, there are no settings to display
    if( slots[0] == null ){
      return <></>
    }

    let S = [];

    //Here is where you can manip the array to your liking:
    for(let i = 0; i < slots.length; i++){

      S.push(
        <div>
          {slots[i]} <br/>
        </div>  
      );
    }

    return <>
      <span className="menu_title_mobile"> Extras </span><br/><br/>
      {S}
    </>
  }
  
  return (
    (trigger) ? (
        <div className="popup_bg" >
            <PopUpPadding executeClose={closePopUp}/>
            <div className="popup_inner">
            <button className="btn-close" onClick={() => {setTrigger(false);  }}/>

              <span className="menu_title_mobile"> {app_name}'s Menu </span><br/><br/>

              <a className="header_text_mobile" href="/about/us">Our Team</a> <br/>
              <a className="header_text_mobile" href='/calendar'> My Calendar</a> <br/>
              <a className="header_text_mobile" href='/clubs'> My Clubs</a><br/>
              <a className="header_text_mobile" href='/optimize'> Optimizer</a><br/><br/>

              {genSettings(slotList)}
            </div>
        </div>
    ) : ""
  )
}

export default PageHeaderPopUp