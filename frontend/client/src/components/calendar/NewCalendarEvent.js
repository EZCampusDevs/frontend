import React from 'react';

const NewCalendarEvent = ({eventBlob, colStart, timeStart, timeEnd, color, EARLIEST_INTR , DENOM_FACTOR, onClickCallback, viewState}) => {
    
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

      
      // If View State is Desktop Mode, colStart is itself, if mobile, it's 2
      const columnStart = viewState === 2 ? 2 : colStart;

      return (
        <div 
            onClick={() => {onClickCallback(eventBlob)}}
            className={`${color ? color : "bg-blue-300"} rounded-lg shadow transition duration-300 cursor-pointer r_font`}
            style={{
                gridColumnStart: columnStart, 
                gridRowStart: verticalRowStart,
                gridRowEnd : verticalRowStart+nRows,
                width : viewState === 2 ? "60vw" : "12vw"
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
