import React from 'react'

const NewCalendarEvent = ({colStart, timeStart, timeEnd}) => {

  const parseTime = (timeStr) => {
    return timeStr.split(':').map(e => {return parseInt(e)});
  }

  const computeDelta = (tS, tE) => {
    let diffHours = (tE[0] - tS[0]) * 60; 
    let diffMinutes = tE[1] - tS[1];
    let diffSeconds = (tE[2] - tS[2]) / 60;
  
    return diffHours + diffMinutes + diffSeconds;
  }

  let tS = parseTime(timeStart); 
  const tE = parseTime(timeEnd);

  let deltaMins = computeDelta(tS, tE);
  
  const generateEvent = () => {
    let top = (tS[0] * 60 + tS[1]) / (24 * 60) * 100;  // percentage of a day
    let height = deltaMins / (24 * 60) * 100;  // percentage of a day
    let left = ((colStart - 1) * (100 / 8.30))+3.65;  // each column represents 1/7th of the total width assuming 7 days view
    let width = 100 / 8.5;  // each column represents 1/7th of the total width assuming 7 days view

    return (
      <div 
        className="bg-blue-200 absolute"
        style={{
            top: `${top}%`,
            height: `${height}%`,
            left: `${left}%`,
            width: `${width}%`,
        }}
      >
        LL
      </div>
    );
  }
  
  return generateEvent();
}

export default NewCalendarEvent
