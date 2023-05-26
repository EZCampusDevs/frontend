import React from 'react'
import { useEffect } from 'react';
import '../../static/css/calendar.css';

//Loggers:
import {logVoid} from '../../util/logger';

//Component imports:
import CalendarPopUp from './CalendarPopUp';
import ClubPopUp from '../club/ClubPopUp';
import useScript from '../../util/hooks/useScript';
import CalendarEvent from './CalendarEvent';

//local
import { titleCropAt, titleScale, weekArrayFill } from '../../util/dataFormatting';

//hooks
import useWindowDimensions from '../../util/hooks/useWindowDimensions';

const Calendar = ({current, crn_full , personalized, scrollForward, scrollBackward, abort_header}) => {

  useScript("https://kit.fontawesome.com/a076d05399.js");

  const [columns,setColumns] = React.useState([]);
  const [crnPopPayload,setCRNPop] = React.useState(false);
  const [clubPopPayload, setClubPop] = React.useState(false);

  //Swipe for MOBILE stuff:
  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);

  //Dimensions hook
  const { height, width } = useWindowDimensions();

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  //Mobile Scrolling Interaction & Triggers

  const onTouchStart = (e) => {
    setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX)
  } 

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if(isLeftSwipe) {
      scrollBackward();
    } 

    if(isRightSwipe){
      scrollForward();
    }
    // if (isLeftSwipe || isRightSwipe) console.log('swipe', isLeftSwipe ? 'left' : 'right')
  }


  const generateCols = () => {

    console.log(current); // cParsed Data being used to generate event objects
    console.log(crn_full); // Links set my user
    console.log(personalized); //Boolean to indicate if pop ups are for user or for viewing purposes only
    //Generation of column headers:

    const head = [
        '' , 'Monday',
        'Tuesday', 'Wednesday' , 'Thursday',
        'Friday', 'Saturday',  'Sunday' 
    ]

    const vhCONSTANT = 2;

    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    
    // Width Scaling

    const dateHeader = (width, header, dateDisp) => {

      if(abort_header){

        return ( <div className="header_cell">{dateDisp}</div> );

      } else {
        if(width > 620){
          return ( <div className="header_cell">{header} , {dateDisp}</div> );
        } else {
          return ( <div className="header_cell">{dateDisp}</div> );
        }
      }


    }

    const timeDisplayScale = (width, iter) => {

      if(width > 620){

        if(iter === 12){return "12:00 PM";}
        if(iter === 24){return "12:00 AM";}

        return (iter > 12) ? (iter - 12).toString() + ' PM' : iter.toString() + ' AM' ;

      } else {

        if(iter === 12){return "12PM";}
        if(iter === 24){return "12AM";}

        return (iter > 12) ? (iter - 12).toString() : iter.toString()  ;
      }

    }

    let dateDisplay = [];

    //This for loop generates all the date strings for the footer array (for the bottom of the calendar UI)


    if(abort_header){ //Is aborting date headers:
      dateDisplay = head.slice(1,head.length);

    } else { //Isn't aborting date headers:

      logVoid("CURRENT #: ")

      //! Very bad "Band-Aid fix" implementation
      current = weekArrayFill(current);

      for(let j = 0; j < 7; j++){
        const currentEntry = current[j];
        dateDisplay.push(
          monthNames[currentEntry.date.getMonth()] //Gets the month as a string name
          + ' ' +  currentEntry.date.getDate()
          );
      }
    }

    //Activating pop up for CRN events 
    let activateCRNpop = (e) => {
      const pID = e.target.id.split('_');
      console.log(pID);
      const popEntry = current[parseInt(pID[0])-1];

      for(const event of popEntry['events']){
        if(event.description.CRN === pID[1].slice(0,-1)){
          let passEvent = event;

          if(crn_full){
            for(const link of crn_full){
              if(link[1] === event.description.CRN){
                  passEvent.crn_link = link[2];
              }
            }
          }

          setCRNPop(passEvent)
        }
      }
    }

    //Activating pop up for Club events
    let activateCLUBpop = (e) => {
      const pID = e.target.id.split('_');
      const popEntry = current[parseInt(pID[0])-1];

      for(const event of popEntry['events']){
        if(event.uuid === pID[1]){
          setClubPop(event)
        }
      }
    }

    let c = []

    for(let i = 0; i < 8; i++){

      const currentEntry = current[i-1];

      let eventList = [];

      if(i !== 0){
        for(let k = 0; k < (currentEntry.events).length; k++){ 

          const event = currentEntry.events[k];

          // CRN EVENT:

          if(event.event_type === 'crn'){
            //Now I need to set the CSS Parameters for the event:
  
            let eStart = event.start.split(':');
            eStart = eStart.map(e => {return parseInt(e)})
  
            //Turning eStart into a decimal representation of the start time: (to use in calculations)
            eStart = eStart[0] + eStart[1] / 60;
  
            let eEnd = event.end.split(':');
            eEnd = eEnd.map(e => {return parseInt(e)})
  
            //same thing for eEnd
            eEnd = eEnd[0] + eEnd[1] / 60;
          
            let eDescription = event.description;

            //margin-top
            // console.log( ((25-eStart)*2*vhCONSTANT) )
  
            eventList.push(
              <CalendarEvent
                onClickTrigger={ activateCRNpop }
                event={
                  {
                    //ID elements
                    id : eDescription.CRN, 
                    type : 'c',
                    iterator : i,

                    //Sizing & positioning
                    width : width,
                    vhc : vhCONSTANT,
                    start : eStart,
                    end : eEnd,

                    //Cosmetics
                    bg_color : event.bg_color, 
                    title : event.title,
                  }
                }
              />  
          )
  
          }

          if(event.event_type === 'club'){
            let eStart = event.time_start.split(':');
            eStart = eStart.map(e => {return parseInt(e)})
  
            //Turning eStart into a decimal representation of the start time: (to use in calculations)
            eStart = eStart[0] + eStart[1] / 60;
  
            let eEnd = event.time_end.split(':');
            eEnd = eEnd.map(e => {return parseInt(e)})
  
            //same thing for eEnd
            eEnd = eEnd[0] + eEnd[1] / 60;
          
            let eDescription = event.description;

            // margin-top
            // console.log( ((25-eStart)*2*vhCONSTANT) )
  
            eventList.push(
              <CalendarEvent
                onClickTrigger={ activateCLUBpop }
                event={
                  {
                    //ID elements
                    id : event.uuid, 
                    type : '',
                    iterator : i,

                    //Sizing & positioning
                    width : width,
                    vhc : vhCONSTANT,
                    start : eStart,
                    end : eEnd,

                    //Cosmetics
                    bg_color : event.bg_color, 
                    title : event.meeting_title,
                  }
                }
              /> 
          )

          }
          
        }
      }


        //Generate Vertical times
        if(i === 0){
            let d = []
            for(let j = 1; j < 25; j++){

                let interval = timeDisplayScale( width, j );

                d.push(
                <>
                    <div className="time_cell_nula"><p className="time_text">{interval}</p></div>
                    
                    <div className="bottom_time_cell"></div>
                </>);
            }
            c.push(<div className="zero_marpad col" key={i}><div className="header_cell">{head[i]}</div>{d}</div>)
            continue;
        } //end of if

        let background_cells = []

        for(let j = 1; j < 25; j++){

          if(j === 24){
            background_cells.push(
              <>
                  <div className="bg_top_div"></div>
                  <div className="bg_bottom_div"></div>
                  <div className="footer_cell"></div>
              </>)
              continue;
          }

          background_cells.push(
          <>
              <div className="bg_top_div"></div>
              <div className="bg_bottom_div"></div>
          </>)
      }


        c.push(<div className="zero_marpad col" key={i}>
          {dateHeader(width, head[i], dateDisplay[i-1])}
          {background_cells}
          {eventList}
        </div>)


    }
    setColumns(c);

    //Generation of classes:
  }  

  //Props need to be the constraint for this useEffect

  useEffect(() => {
    generateCols()
  }, [current, width]);


  return (
<div className="primary_calendar_container_nula" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
  <div class="row">
    {columns}
  </div>
  <CalendarPopUp trigger={crnPopPayload} setTrigger={setCRNPop} personalized={personalized}/>
  <ClubPopUp trigger={clubPopPayload} setTrigger={setClubPop}/>
</div>
  )
}

export default Calendar