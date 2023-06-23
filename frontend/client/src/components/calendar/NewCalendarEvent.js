import React from 'react'

const NewCalendarEvent = ({colStart, timeStart, timeEnd}) => {

  //? #################### Format Helpers ####################

  const parseTime = (timeStr) => { // "01:00:00" -> [1,0,0]  where hr / min / sec
    return timeStr.split(':').map(e => {return parseInt(e)});
  }

  const computeDelta = (tS, tE) => {
    // calculate differences directly, convert everything to minutes
    let diffHours = (tE[0] - tS[0]) * 60; 
    let diffMinutes = tE[1] - tS[1];
    let diffSeconds = (tE[2] - tS[2]) / 60;
  
    // Return in minutes different between End and Start
    return diffHours + diffMinutes + diffSeconds;
  }

  //? #################### Format Helpers ####################

  let tS = parseTime(timeStart); 
  const tE = parseTime(timeEnd);

  let deltaMins = computeDelta(tS, tE);
  
  const generateEvent = () => {

    let rowStart = 3 + (tS[0] * 2); // 3 row offset, plus double the hour
    
    if(tS[1] >= 30){ // If's its like 9:30, boost it a col
      rowStart++;
      tS[1] -= 30;
    }

    let className = "bg-blue-200 ";
    className += rowStart;
    
    const rowEnd = rowStart+(deltaMins/30);

    return <div 
      className = {className}
    style={{
        gridRowStart: rowStart,
        gridRowEnd : rowEnd,
        gridColumnStart : colStart
      }}>

    LL

    </div>

  }


  
  return generateEvent();
}

export default NewCalendarEvent