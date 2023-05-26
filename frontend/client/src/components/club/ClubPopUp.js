import React from 'react'

//Component imports
import MeetingSequenceView from './MeetingSequenceView';
import PopUpPadding from '../util/PopUpPadding';

//static & util imports
import {timeFormat, dateFormat, duration, timeStr2Unix} from '../../util/dataFormatting';
import '../../static/css/club.css';

const ClubPopUp = (props) => {


  let pDateStr = (dateStart) => { //Turns "string like 2022-09-29" into  date obj
    let ret = dateStart.split('-');
    ret.map(e => {return parseInt(e)});
    return new Date(ret[0],(ret[1]-1),ret[2])
  }

  const meetingJSX = () => {
    return (<div className="side_by_side_wrapper section_wrapper">
      
      
      {/* LEFT PANEL (VIEWING DATE SEQUENCE, OR SINGULAR DATE) */}
      <div>
      {props.trigger.repeat_timedelta_days ? (<MeetingSequenceView 
        start={pDateStr(props.trigger.date_start)} 
        end={pDateStr(props.trigger.date_end)} 
        interval={props.trigger.repeat_timedelta_days} 
        selected={props.trigger.event_date}
      />) 
      : 
      (
        <div className="info_light">
          Only occurance on {dateFormat(new Date ,timeStr2Unix(props.trigger.time_start))}
        </div>
      )
      }
      </div>

      
      {/* RIGHT PANEL (VIEWING CLUB DESC, MEET INFO) */}
      <div>
       <div className="info_title" style={{textAlign : 'center'}}>
          {props.trigger.meeting_title} :
       </div>

        <div className="info_light">
        {props.trigger.meeting_description}
        </div>


        <br/>
        <div className="info_title" style={{textAlign : 'center'}}>
          Meet Info :
       </div>

       <div className="info_light">
       <span className="info_title">Occurs:</span> 
       {
        props.trigger.repeat_timedelta_days ? 
        dateFormat(props.trigger.event_date) : 
        dateFormat(new Date ,timeStr2Unix(props.trigger.time_start)) 
       }  from 

       {' '+timeFormat(props.trigger.time_start)} to 
       {' '+timeFormat(props.trigger.time_end)}
       <br/>
       <span className="info_title">Approximate duration:</span>
        {duration(props.trigger.time_end,props.trigger.time_start )}
        <br/>
        <span className="info_title">
          {props.trigger.is_virtual ? (<>
                         <div class="fas fa-desktop" 
                         style={{fontSize: '1vw', paddingRight: '0.5vw', paddingTop: '0.5vh'}}>
                           </div>
                            Virtual event<br/>
                            <div class="fas fa-link" 
                         style={{fontSize: '1vw', paddingRight: '0.5vw', paddingTop: '0.5vh'}}>
                           </div> <a href={props.trigger.location} target="_blank">{props.trigger.location}</a>
                           </>                
          ) : 
          (<>
            <div class="fas fa-user" 
            style={{fontSize: '1vw', paddingRight: '0.5vw', paddingTop: '0.5vh'}}>
              </div>
               In-person event<br/>
               <div class="fas fa-map-pin" 
                         style={{fontSize: '1vw', paddingRight: '0.5vw', paddingTop: '0.5vh'}}>
                           </div> {props.trigger.location}
              </>         
          )}
          </span>
    
    </div>


      </div>

    </div>)
  }


  const clubLinkJSX = () => {
    return(
      <a href={"/club/"+props.trigger.uuid} target="_blank" className="btn btn-primary">View Club Page</a>
    )
  }

  const closePopUp = () => {
    props.setTrigger(false);
  }

    return (
        (props.trigger) ? (
          <div className="popup_bg">
            <PopUpPadding executeClose={ closePopUp }/>
              <div className="popup_inner">
              <button className="btn btn-close" onClick={() => {closePopUp();}}/>
                <h3 className="main_pop_title">{props.trigger.title}</h3>
            {clubLinkJSX()}
            {meetingJSX()}
                {/* <MeetingSequenceView start={props.trigger.time_start} end={props.trigger.time_end} interval={props.trigger.repeat_timedelta_days}/> */}
              </div>
  
          </div>
        ) : ''
      )
}

export default ClubPopUp