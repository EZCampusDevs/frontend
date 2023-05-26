import React from 'react'

//Local stuff:
import {timeFormat} from '../../util/dataFormatting';
import '../../static/css/popup.css'

//Components:
import PopUpPadding from '../util/PopUpPadding';

const CalendarPopUp = ({trigger , setTrigger , personalized}) => {

  const [linkPop, setLinkPop] = React.useState(false);

  //Shortening props.trigger.description to PTD
  const PTD = trigger.description

  //Copy Function used by the CLIPBOARD buttons
  const copyFunc = (value) => {
    navigator.clipboard.writeText(value);
  }

  //Render Instructor JSX or edge-case message
  const InstructorJSX = () => {

    if(PTD['Instructor']) {

      const name = PTD['Instructor'];
      const email = PTD['Instructor Email'];
      const rating = (PTD['Instructor rating'] * 100).toFixed(2);

      return <>
        <span className="info_title">Instructor Information:</span>
        <br/>
        <div className='section_wrapper'>
          <span className="info_title">Name:</span> {name} <br/>
          <span className="info_title">Email:</span> {email} 
          <button className="btn btn-primary copy_btn" onClick={(e) => { copyFunc(email); e.currentTarget.textContent = '✔️' }}>📋</button> <br/>
          <span className="info_title">RMP Rating:</span> {rating} %<br/>
        </div>
      </>
      
    } else {return <><span className="info_title">No instructor information to display...</span><br/></>}
  }
  
  //Section info:
  const SectionJSX = () => {
    return <>
      <br/>
      <span className="info_title">Course Information:</span>
      <br/>
      <div className='section_wrapper'>
        <span className="info_title">CRN:</span> {PTD["CRN"]} <br/>
        <span className="info_title">Section:</span> {PTD["Section"]} <br/>
        <span className="info_title">Occupancy:</span> {PTD['Seats filled']} / {PTD['Max capacity']}  Seats filled.  <br/>
        <span className="info_title">Location:</span> {trigger.location} <br/>
      </div>
    </>
  }

  const ClassJSX = () => {

    return <>
      <br/>
      <span className="info_title">Class Times:</span>
      <br/>
      <div className="section_wrapper">
      <span className="info_title">Starts at:</span> {timeFormat(trigger.start)} ({trigger.start}) <br/>  
      <span className="info_title">Ends at:</span> {timeFormat(trigger.end)} ({trigger.end}) <br/> 
      </div>
    </>

  }


  const closePopUp = () => {
    setTrigger(false); setLinkPop(false);
  }

  return (
      (trigger) ? (
        <div className="popup_bg">
            <PopUpPadding executeClose={closePopUp}/>
            <div className="popup_inner">
            <button className="btn btn-close" onClick={() => {closePopUp();}}/>
              <h3 className="main_pop_title">{trigger.title}</h3>

              {InstructorJSX()}
              {ClassJSX()}
              {SectionJSX()} 

            </div>

        </div>
      ) : ''
    )
}

export default CalendarPopUp