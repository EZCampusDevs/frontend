import React from 'react'

import '../../static/css/search_pg.css';
import { titleCropAt } from '../../util/dataFormatting';
const ClubElement = ({entry}) => {
  return (
    <div className="club_entry" style={{'backgroundColor' : entry.colour ? entry.colour : "#536872" }}onClick={() => {window.open('/club/'+entry.uuid)}}>
      <h3 className="club_entry_title">{entry.name}</h3> 


      <div className="club_entry_info">
      <span className="club_category">{entry.category}</span>

      <div className="club_entry_inner">

      <span className="club_s_count">  
      <div class="fas fa-user" 
            style={{fontSize: '1vw', paddingLeft: '0.5vw', paddingRight: '0.5vw', paddingTop: '0.5vh'}}>
              </div>
      {entry.subscriber_count } / {entry.subscribe_capacity} Subscribers
      <div class="fas fa-calendar" 
            style={{fontSize: '1vw', paddingLeft: '0.5vw', paddingRight: '0.5vw', paddingTop: '0.5vh'}}>
              </div>
      {entry.meetings.length} Events Available <br/>
      </span>
      <span className="club_description">
       { titleCropAt(
      (entry.description === "" ? "No descripton to display..." : entry.description) , 200 )}


      </span>
      </div>



      </div>


    </div>
  )
}

export default ClubElement