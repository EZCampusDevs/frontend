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

  //TODO: move this to utility module
  function convertTo12HourFormat(timeString) {
    // Split the time string by ':' to get hours, minutes, and seconds
    let [hours, minutes, seconds] = timeString.split(':');

    // Convert the hours to a number so we can perform calculations
    hours = parseInt(hours, 10);

    // Determine the suffix and adjust hours if necessary
    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert hour 00 and 12 to 12

    // Return the formatted time string
    return `${hours}:${minutes} ${suffix}`;
  }

  const tS = parseTime(timeStart);
  const tE = parseTime(timeEnd);
  let deltaMins = computeDelta(tS, tE);

  const nameCrop = (string, delta) => {
    // Calculate the maximum number of characters allowed
    let charMax = Math.floor(28 + delta / 2);
    let croppedString = string.substring(0, charMax);

    // Split the string into words
    let words = croppedString.split(' ');

    // If the last word is less than 3 characters, remove it
    if (words.length > 1 && words[words.length - 1].length < 3) {
        words.pop();
    }

    // Rejoin the words into a single string and return
    return words.join(' ');
};

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
          {nameCrop(eventBlob["name"],deltaMins)} <br/>
          <p>
          {convertTo12HourFormat(eventBlob["time_start"])+" - "} 
          {convertTo12HourFormat(eventBlob["time_end"])} 
          </p>
          <br/>
        </>
      }

      
      // If View State is Desktop Mode, colStart is itself, if mobile, it's 2
      const columnStart = viewState === 2 ? 2 : colStart;

      return (
        <div 
            onClick={() => {onClickCallback(eventBlob)}}
            className={`rounded-lg shadow transition duration-300 cursor-pointer r_font`}
            style={{
                gridColumnStart: columnStart, 
                gridRowStart: verticalRowStart,
                gridRowEnd : verticalRowStart+nRows,
                width : viewState === 2 ? "60vw" : "12vw",
                backgroundColor: color ? color : '#b8daff' // Using HEX color if available, otherwise a default value
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered ? genHovered() : nameCrop(eventBlob["name"],deltaMins)}
        </div>
      );
      
    }
  };

  return generateEvent();
};

export default NewCalendarEvent;
