import React from 'react'
import { titleScale } from '../../util/dataFormatting'

const CalendarEvent = ({onClickTrigger, event}) => {
  
    //event prop's structure:
    // .bg_color 
    // .iterator
    // .width
    // .id
    // .type (CRN, CLUB, etc..)
    // .title
    // .vhc (VHCONSTANT being passed down)
    // .start & .end for the margin and height settings
    
    const iconScaleToggle = (width, threshold) => {
        if(width > threshold){
            return <div class="fas fa-book" 
            style={{fontSize: '1vw', paddingLeft: '0.5vw', paddingRight: '0.5vw', paddingTop: '0.5vh'}}>
              </div>
        }
        return ''
    }

  const ID = event.iterator+'_'+event.id + event.type

  return (
    <div onClick={onClickTrigger} className="event_default" style={{
        'margin-top' : ((25-event.start) * 2 * event.vhc) * -1+"vh" , 
        'height': ((event.end - event.start) * 2 * event.vhc)+"vh" , 
        'backgroundColor' : event.bg_color
      }} id={ID}>

        {iconScaleToggle(event.width, 800)}
        {titleScale(event.width, 800, ID, event.title)}
      </div>
  )
}

export default CalendarEvent