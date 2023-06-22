import React from 'react'

const NewCalendarEvent = ({colStart, timeStart, timeEnd}) => {

  const parseTime = (timeStr) => { // "01:00:00" -> [1,0,0]  where hr / min / sec
    return timeStr.split(':').map(e => {return parseInt(e)});
  }

  let tS = parseTime(timeStart); 
  const tE = parseTime(timeEnd);

  let delta = [tE[0]-tS[0] , tE[1]-tS[1] , tE[2]-tS[2]];
  console.log(delta)

  
  const generateEvent = () => {

    var collapsedTS = tS[0] + tS[1]/60 + tS[2] / 3600; 

    let rowStart = 3 + (tS[0] * 2); // 3 row offset, plus double the hour
    
    if(tS[1] >= 30){
      rowStart++;
      tS[1] -= 30;
    }


    const mt = 0;

    let className = "bg-blue-200 h-16 col-start-"+colStart+' ';
    className += rowStart;


    return <div 
      className = {className}
    style={
      {gridRowStart: rowStart}
    }>

    LL

    </div>

  }


  
  return generateEvent();
}

export default NewCalendarEvent