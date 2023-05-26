//Npm library imports

import React from 'react'

//Component imports:
import GenerateTimeOptions from '../util/GenerateTimeOptions'
import LengthCount from '../util/LengthCount';
import MeetingSequenceView from './MeetingSequenceView';

//Static *& Util imports
import {timeFormat, dateFormat, duration} from '../../util/dataFormatting';

//Redux
import { useSelector, useDispatch } from 'react-redux'

const MeetingComponent = ({passBack, index, savedPayload}) => {

  const meetStore = useSelector((state) => state.meetingEdit.meeting_entries)

  //Constants:
  const weekday = [
    'Monday' , 'Tuesday', 'Wednesday',
   'Thursday' , 'Friday', 'Saturday' , 'Sunday'
 ]

  //Render states:

  const [vis, setVis] = React.useState(true);  
  const [renderState, setRenderState] = React.useState(0);

 //Checkbox select booleans
  const [repeatSelect, setRS] = React.useState(false);

  const [locationSelect, setLS] = React.useState(false);   

  const[repeatDateDisp, setRDD] = React.useState(-1);
  const[meetDateDisp,setMDD] = React.useState([]);
  const[dateInterval, setDI] = React.useState();

  const[meetTitleLen, setMTL] = React.useState(0);
  const[meetDescLen, setMDL] = React.useState(0);

  //State for Start & End
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] =     React.useState(new Date());

  //Refs (States)
  //This references need to be useState since it can't be dependant on a JSX component (As in this case, they get deleted & regenerated)
   const [meetName, refMN] = React.useState('');

   const [startTime, refST] = React.useState('12:00:00');
   const [endTime, refET] = React.useState('13:00:00');
   const [timeDelta,refTD] = React.useState('7');

   const [meetRepInterval, refMRI] = React.useState('');
   const [meetLocation, refML] = React.useState('');
   const [meetDesc, refMD] = React.useState('');


  //util funcs:

  const trackLength = (event, setState) => {
    setState((event.target.value).length);
  }

  const genIntervals = () => {

    let intervals = [
      ['Weekly' , 7],
      ['Bi-Weekly',14],
      ['Monthly ',28],
      ['Bi-Monthly', 56]
    ]

    let gen = [];

    for(const interval of intervals){
      gen.push(
        <option value={interval[1]} >{interval[0] + ' > '+String(interval[1])+' day interval'}</option>
      )
    }

    return gen;

  }

  const dateIntervalSet = () => {

    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    let days = parseInt(Math.floor(endDate - startDate) / _MS_PER_DAY);

    const timeFrame = ( (Math.floor(days/30) !== 0) ? String( Math.floor(days/30) ) + ' months ' : '' )
    +String(days % 30) +' day(s) '

    setDI(
      timeFrame
    )

  }
  
  const rawDateSequence = (start,end,interval) => {
    let sequence = []
    let j = 0;
    while(true){

      // start time in unix seconds + (interval amount of days * integer counter)
      let newUnixSecs = ( start.getTime() / 1000 ) + (interval * j * 86400);

      if(newUnixSecs > ( (end.getTime() / 1000)+86400) ){
        break;
      }

      const dat = new Date(newUnixSecs*1000)

      sequence.push(dat);

      j++;

    }

    console.log('rDS RETURNING: ',sequence.at(-1))

    return sequence.at(-1);  
  }


  const deleteButtonJSX = () => {
    return  <button className="btn btn-danger" onClick={()=>{
      setRenderState(-1); 
      passBack(0,index,'');
    }}>Delete</button>
  }

  const paragraph = (string) => {
    if(!string){return 'No description to display...'}

    let lines = string.match(/.{1,30}/g);
    let formattedLines = []

    for(const l of lines){
      formattedLines.push(<p>{l}</p>)
    }

    return formattedLines
  }


  const titleChop = (string) => {
    //TODO: Add title chopping for meet titles

    const strLen = 35

    if(string.length >= strLen){
      return string.slice(0,strLen) + '...' ;
    } 
    return string
  }

  //Turns date objects into YYYY-MM-DD strings

  const dateFormatJSON = (date) => {
    let elements = [
      date.getYear()+1900 , date.getMonth()+1, date.getDate()
    ];

    elements = elements.map(e => {return String(e)});

    let formatted = elements[0]+'-';

    for(let i = 1; i < 3; i++){

      if(elements[i].length === 1){ formatted += '0'+elements[i]; } 
      else{ formatted += elements[i]; }

      formatted += '-'
    }

    return formatted.slice(0,-1)

  }

  //Turns YYYY-MM-DD strings into date objects

  let reverseDateFormatJSON = (dateStart) => { //Turns "string" into  Date obj
    let ret = dateStart.split('-');
    ret = ret.map(e => {return parseInt(e)});
    return new Date(ret[0],(ret[1]-1),ret[2]);
  }

  //Api takes a different weekday int than Date.getDay() returns:
  const dayFix = (day) => {
    if(day === 0){ day = 6; } //If Sunday, make it 6 
      else if(day <= 6){ day -= 1;  } //If any other day, sub 1
    return day;
  }

  const loadSavedPayload = (payload) => {

    //Check if payload is true, assume it's an object and populat component state
    if(payload){

      setRenderState(1);

      refMN(payload["name"]);
      refMD(payload["description"]);
      
      refST(payload["time_start"]);
      refET(payload["time_end"]);

      refML(payload["location"]);
      setStartDate(reverseDateFormatJSON(payload["date_start"]));
      setEndDate(reverseDateFormatJSON(payload["date_end"]));

      refTD(String(payload['repeat_timedelta_days']));

      
      setRS((payload['repeat_timedelta_days'] == 0) ? false : true);
      setLS(payload['is_virtual']);

      savedPayload = false;
    }

  }


  const buildEventJSON = () => {

    const weekday_int = dayFix(startDate.getDay());

    return {
      "time_start" : startTime,
      "time_end" : endTime,
      "weekday_int" : weekday_int,
      "date_start" : dateFormatJSON(startDate), //Backend want's a proper end date.
      "date_end" : repeatSelect ? dateFormatJSON( rawDateSequence(startDate, endDate, parseInt(timeDelta)) ) : dateFormatJSON(startDate),
      "repeat_timedelta_days" : repeatSelect ? parseInt(timeDelta) : 0,
      "location" : meetLocation,
      "name" : meetName,
      "description" : meetDesc,
      "seats_filled" : 0,
      "max_capacity" : -1,
      "is_virtual" : locationSelect 
    }

  }

  const repeatSwitch = (repeat) => {
    if(repeat){
      return <div className="meet_mid_wrapper">
      <div className="info_title">This meeting is currently set to repeat across multiple dates.</div>
      <button className="btn btn-primary" onClick={() => {setRS(false)}}>Switch to single occurance</button>
      <br/>
      {/* Start Date */}
        <span className="info_title">Start date :</span> <span className="info_light">( This is the date of your first meet )</span>

        <input type="date" className="form-control" selected={startDate} onChange={(date) => {
        setStartDate(date);
        setRDD(date.getDay());
          } } />

      {/* End Date */}
        <div className="info_title">End date </div>
        <input type="date" className="form-control"  selected={endDate} onChange={(date) => {setEndDate(date);}} /> 



      {/* Time repeat delta section */}
        <div className="info_title">Repetition Interval </div>
        <select 
        className="form-select form-select-box-shadow"
        defaultValue={timeDelta}
        onChange={e => (refTD(e.target.value))}
        >
          {genIntervals()}
        </select> 

      {/*Useful info */}
      {(repeatDateDisp === 0) ? weekday[6] : weekday[repeatDateDisp-1] }          
      <div className="info_title">Meet dates:</div>

      <MeetingSequenceView start={startDate} end={endDate} interval={timeDelta} />

      </div>
    //ELSE
    } else {
      return  <>

      This meeting is currently set to occur once, on a singular date.
      <button className="btn btn-primary" onClick={() => {setRS(true)}}>Switch to multiple occurances</button>

      <div>
      <div>Date of meeting</div>
    <input type="date" selected={startDate} onChange={(date) => {
      setStartDate(date);
      setRDD(date.getDay());
    }
    } />
      {(repeatDateDisp === 0) ?
      weekday[6] : weekday[repeatDateDisp-1]  
    }
    </div>

      </>
    }
  }


  const edit_tmpl  = <div className="section_wrapper" key={index}>
    <div className="meeting_title">

      <input 
      className="form-control" 
      placeholder="Meeting Name" 
      onChange={(e) => {trackLength(e , setMTL);
      refMN(e.target.value)
      }}
      defaultValue={meetName}
      />
      <LengthCount state={meetTitleLen} threshold={99} />


      {deleteButtonJSX()}
    </div>
  
     <div className="three_section_wrapper">
    {/*Left Column (Start/End times) */}
    <div>
    <span className="info_title"> Start Time:</span>
      <select 
        className="form-select form-select-box-shadow"
        defaultValue={startTime}
        onChange={e => (refST(e.target.value))}

      >
            <GenerateTimeOptions/>
        </select>

        <span className="info_title"> End Time: </span>
      <select 
        className="form-select form-select-box-shadow"
        defaultValue={endTime}
        onChange={e => (refET(e.target.value))}
      >
            <GenerateTimeOptions/>
        </select>  
    </div>

    {/*Mid Column (Event repetitions) */}
    <div>
        <div className="meet_mid_wrapper">
        {repeatSwitch(repeatSelect)}

        </div>
    </div>

    {/*Right Column (Other params) */}
    <div>
          

          <div>
            <div className="meet_wrap">
              {locationSelect ? 
              (            <input type="checkbox" className="form-check-input" onChange={ (e) => {
                setLS(e.target.checked);  
              } } defaultChecked/>) : 
              (   <input type="checkbox" className="form-check-input" onChange={ (e) => {
                setLS(e.target.checked); 
              } } />) 
              }

              {locationSelect ? 
              (<div className="info_title">Virtual Meeting:</div>) : 
              (<div className="info_title">In-Person Meeting:</div>) 
              }
              </div>

              <input placeholder={(locationSelect ? 'Meet link' : 'Meet location')} 
                className="form-control" 
                onChange={(e) => { refML(e.target.value) }}
                defaultValue={meetLocation}  
              />
              
          </div>
          <br/>

          <div className="mini_two_wrapper">
            <div className="info_title">Description:</div>
            <LengthCount state={meetDescLen} threshold={199} />
          </div>
          <textarea 
        defaultValue={meetDesc}
        onChange={(e) => {trackLength(e , setMDL); refMD(e.target.value) }}
        className="form-control" 
        rows="4"
        Placeholder="Briefly describe your meeting... (optional)" 
      />

      </div>

    </div>

    {/*Footer of edit template */}
    <button className="btn btn-primary" onClick={()=>{setRenderState(1); passBack(1,index,buildEventJSON());}}>Save</button>
    <div className="meeting_component_footer"/>
  </div> 
//End of edit template

const saved_tmpl = <div className="section_wrapper" key={index}>
  {/*First Row (title & 2 btns) */}
  <div className="three_title_wrapper">
      <div className="big_info_title">
              {meetName ? titleChop(meetName) : '⚠️ Missing Name'}
      </div>
    <button className="btn btn-primary" onClick={()=>{setRenderState(0)}}>Edit</button>
    {deleteButtonJSX()}
  </div>
  {/*Second Row (With 3 equal columns) */}
  <div className="three_section_wrapper">
     {/*Left COL */}
     <div>
       <div className="info_light"><span className="info_title">Starts at: </span> {timeFormat(startTime)} </div>       
       <div className="info_light"><span className="info_title">Ends at: </span> {timeFormat(endTime)} </div>    
       <br/>
       <div className="info_light"><span className="info_title">Meeting duration:</span> {duration(endTime,startTime)} </div>   
       <div className="info_light"><span className="info_title">Meeting repetition interval:
       </span> 
       {repeatSelect ? ('every '+ timeDelta +' day(s)') : 'N/A'}
        </div> 
       <br/>
       <div className="info_light"><span className="info_title"> Location: </span> 

       {meetLocation ? (locationSelect ? <a href={meetLocation}>{meetLocation}</a> : meetLocation) : 'N/A'}

        </div> 
       <div className="info_light">{locationSelect ? '🖥️ Virtual Meeting' : '📍 In-person Meeting'}</div>


    </div>        

    {/*Middle COL */}
    <div>
       {repeatSelect ? 
      (
      <>
      <div className="info_title">These meetings will occur on:</div>
      <MeetingSequenceView start={startDate} end={endDate} interval={timeDelta} />
     <br/>
      <div className="info_light"><span className="info_title">Meeting occurance period:</span> {dateInterval} </div>   



      </>
      ) 
      :
      (
      <>
      <div className="info_light"><span className="info_title">This meeting occurs on: </span> {dateFormat(startDate)} </div>      
      </>
      )
      }
    </div>

    {/*Right COL */}
    <div>
    <br/>
    <div className="info_title">Meeting Description:</div>
    <p className="info_light">{paragraph(meetDesc)}</p>
    </div>           
  </div>
  <div className="meeting_component_footer"/>
</div>


const renderComponent = (state) => {

  if(state === 0){ //Editing state
    return edit_tmpl
  }
  if(state === 1){ //Saved state
    return saved_tmpl
  }
  if(state === -1){
    return ''
  }
}

//On mount (DEP: Key Props)
React.useEffect(
  () => {
    loadSavedPayload(savedPayload);
  }  , []
)
  

React.useEffect(
  () => {
    console.log('RLING')
  }  
)

  return (
      (vis) ?
    <div>{renderComponent(renderState)}
    </div> : ''
  )
}

export default MeetingComponent