import React from 'react';

const NewCalendarEvent = ({eventBlob, colStart, timeStart, timeEnd, EARLIEST_INTR, LATEST_INTR , DENOM_FACTOR, onClickCallback}) => {
    
  const [isHovered, setIsHovered] = React.useState(false);

  const parseTime = (timeStr) => {
    return timeStr.split(':').map(e => parseInt(e));
  };

  const computeDelta = (tS, tE) => {
    let diffHours = (tE[0] - tS[0]) * 60; 
    let diffMinutes = tE[1] - tS[1];
    let diffSeconds = (tE[2] - tS[2]) / 60;
    return diffHours + diffMinutes + diffSeconds;
  };

  const tS = parseTime(timeStart);
  const tE = parseTime(timeEnd);
  let deltaMins = computeDelta(tS, tE);


  const generateEvent = () => {

    //! Refers to Row of the Event
    console.log("EARLIEST INCR: "+EARLIEST_INTR);
    var verticalRowStart = (tS[0] * 6)+6 + (tS[1]/60*6) - EARLIEST_INTR + 2; 

    //! Height of Event in Rows
    let nRows = Math.floor(deltaMins / (60 / (DENOM_FACTOR*2) ));  // percentage of a day

    //TODO: Fix Hacky If Statements:
    if(tS[0] < 16) {verticalRowStart = verticalRowStart+2;}
    if(tS[0] > 16.5) {verticalRowStart = verticalRowStart+1;}
    //TODO: Fix Hacky If Statements: ^^^

    if(eventBlob){
 
      console.log(tS, tE);

      const genHovered = () => {
        return <>
        {eventBlob["time_start"]} <br/>
        {eventBlob["name"]} <br/>
        {eventBlob["time_end"]} <br/>
        </>
      }


      return (
        <div 
            onClick={() => {onClickCallback(eventBlob)}}
            className={`bg-blue-200`}
            style={{
                gridColumnStart: colStart, 
                gridRowStart: verticalRowStart,
                gridRowEnd : verticalRowStart+nRows,
                width : "12vw"
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered ? genHovered() : eventBlob["name"]}
        </div>
    );

    }

  };

  return generateEvent();
};

export default NewCalendarEvent;
