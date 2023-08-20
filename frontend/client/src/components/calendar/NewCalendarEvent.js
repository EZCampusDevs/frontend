import React from 'react';

const NewCalendarEvent = ({ colStart, timeStart, timeEnd, EARLIEST_INTR, LATEST_INTR , DENOM_FACTOR }) => {
    
  const parseTime = (timeStr) => {
    return timeStr.split(':').map(e => parseInt(e));
  };

  const computeDelta = (tS, tE) => {
    let diffHours = (tE[0] - tS[0]) * 60; 
    let diffMinutes = tE[1] - tS[1];
    let diffSeconds = (tE[2] - tS[2]) / 60;
    return diffHours + diffMinutes + diffSeconds;
  };

  let tS = parseTime(timeStart);
  const tE = parseTime(timeEnd);
  let deltaMins = computeDelta(tS, tE);


  const generateEvent = () => {

    //! Refers to Row of the Event
    var verticalRowStart = (tS[0] * 6)+7 + (tS[1]/60*6)  - EARLIEST_INTR; 

    let top = Math.floor(tS[0] + tS[1]/60);  // percentage of a day
    let height = deltaMins / (24 * 60) * 100;  // percentage of a day

    console.log(tS, tE);

    return (
      <div 
        className={`bg-blue-200`}
        style={{
          gridColumnStart: colStart, 
          gridRowStart: verticalRowStart,
          gridRowEnd : verticalRowStart+2,
          width : "12vw"
        }}>
        LL
      </div>
    );
  };

  return generateEvent();
};

export default NewCalendarEvent;
