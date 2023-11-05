import React from "react";

  //chatgpt : #### WROTE THIS FORMATTING HELPER FN:
  function formatDateToCalendarView(dateString, view) {
    const dateObj = new Date(dateString);
    
    if(!view) {
      dateObj.setDate(dateObj.getDate() - 4); //! HARD CODE, this is a problem
    }


    
    // Array of month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Get the month name from the date
    const monthName = monthNames[dateObj.getMonth()];

    // Get the day from the date
    const day = dateObj.getDate();

    // Get the ordinal suffix for the day
    let ordinalSuffix;
    if (day % 10 === 1 && day !== 11) {
      ordinalSuffix = "st";
    } else if (day % 10 === 2 && day !== 12) {
      ordinalSuffix = "nd";
    } else if (day % 10 === 3 && day !== 13) {
      ordinalSuffix = "rd";
    } else {
      ordinalSuffix = "th";
    }

    return `${monthName} ${day}${ordinalSuffix}`;
  }

export function SevenDayView(weekdays, EARLIEST_TIME, LATEST_TIME, CALENDAR_TOP_ROW_OFFSET, THIRTY_FRAC_DENOM,  calendarView) {
    
    let bg = [];

    for (let wI = 0; wI <= weekdays.length - 1; wI++) {
        // Start from 1 since you have a time column
  
        let bgCol = [];
        let depth = 0;
  
        let timeCounter = 0;
  
        for (
          let i = EARLIEST_TIME;
          i < LATEST_TIME + CALENDAR_TOP_ROW_OFFSET;
          i++
        ) {
          //Adding of Switch button:
  
          let titleBox_CSS_STR = "h-5 text-lg ml-20 w-24 night_text r_font";
          let gridBox_CSS_STR = "h-2 border col-span-1 col_w calendar_border_1 r_font";
          let gridBoxT_CSS_STR = "calendar_border_2";
  
          gridBox_CSS_STR += " col-start-" + String(wI + 1);
  
          titleBox_CSS_STR += " col-start-" + String(wI + 1);
  
          //Line Border Every 3 Lines (Right Before next Time Stamp)
          let isLineBorder =
            timeCounter === 1 ? gridBoxT_CSS_STR : gridBox_CSS_STR;
  
          //!If it's at the earliest column, let's use it for times:
          if (wI === 0 && depth >= CALENDAR_TOP_ROW_OFFSET) {
            let normalized_i = i - CALENDAR_TOP_ROW_OFFSET;
  
            const hour = Math.floor(normalized_i / 6); // Adjusted for 10-min intervals
            const minutes = normalized_i % 6 === 0 ? "00" : "30"; // Adjusted for 10-min intervals
            const time = `${hour}:${minutes}`;
  
            if (!timeCounter) {
              bgCol.push(
                <div
                  class={gridBox_CSS_STR + " text-center font-bold"}
                  style={{
                    gridRowStart: normalized_i + 1,
                    gridRowEnd: normalized_i + 4, // Span 3 rows
                  }}
                >
                  {time}
                </div>
              );
              timeCounter += 2;
            } else {
              bgCol.push(
                <div
                  class={isLineBorder + " text-center font-bold"}
                  style={{
                    gridRowStart: normalized_i + 1,
                    gridRowEnd: normalized_i + 2, // Span 3 rows
                  }}
                ></div>
              );
              timeCounter--;
            }
          } else if (depth === 0) {
            //! Adding DAYs OF THE WEEK
  
            let w = "100vw";
  
            bgCol.push(
              <span
                class={titleBox_CSS_STR}
                style={{
                  gridRowStart: i + 1,
                  gridRowEnd: i + 2,
                  textAlign: "center",
                  height: "3.5vh",
                  width: w,
                }}
              >
                {wI === 0
                  ? ""
                  : calendarView[wI - 1]
                  ? formatDateToCalendarView(calendarView[wI - 1].date, 0)
                  : ""}
                <br />
                {weekdays[wI]}
              </span>
            );
          } else {
            //! Regular Background Cell
  
            const moduloClass =
              i % THIRTY_FRAC_DENOM === 0 ? gridBoxT_CSS_STR : gridBox_CSS_STR;
  
            bgCol.push(
              <div
                class={moduloClass}
                style={{
                  gridRowStart: i + 1,
                  gridRowEnd: i + 2,
                }}
              ></div>
            );
          }
  
          depth++; //To Maintain the Header's spacing
        }
  
        bg.push(<div style={{ gridRowStart: 1 }}>{bgCol}</div>);
      }

      return bg;
}


export function OneDayView(weekdays, EARLIEST_TIME, LATEST_TIME, CALENDAR_TOP_ROW_OFFSET, THIRTY_FRAC_DENOM,  calendarView) {
    
    let bg = [];

    //! MOBILE CONSTANTS FOR CAL:
    const MOBILE_TIME_WIDTH = "20vw";

    for (let wI = 0; wI <= weekdays.length - 1; wI++) {
        // Start from 1 since you have a time column
  
        let bgCol = [];
        let depth = 0;
  
        let timeCounter = 0;
  
        for (
          let i = EARLIEST_TIME;
          i < LATEST_TIME + CALENDAR_TOP_ROW_OFFSET;
          i++
        ) {
          //Adding of Switch button:
  
          let titleBox_CSS_STR = "h-5 text-lg ml-20 w-24 night_text r_font";
          let gridBox_CSS_STR = "h-2 border col-span-1 col_w calendar_border_1 r_font";
          let gridBoxT_CSS_STR = "calendar_border_2";
  
          gridBox_CSS_STR += " col-start-" + String(wI + 1);
  
          titleBox_CSS_STR += " col-start-" + String(wI + 1);
  
          //Line Border Every 3 Lines (Right Before next Time Stamp)
          let isLineBorder =
            timeCounter === 1 ? gridBoxT_CSS_STR : gridBox_CSS_STR;
  
          //!If it's at the earliest column, let's use it for times:
          if (wI === 0 && depth >= CALENDAR_TOP_ROW_OFFSET) {
            let normalized_i = i - CALENDAR_TOP_ROW_OFFSET;
  
            const hour = Math.floor(normalized_i / 6); // Adjusted for 10-min intervals
            const minutes = normalized_i % 6 === 0 ? "00" : "30"; // Adjusted for 10-min intervals
            const time = `${hour}:${minutes}`;
  
            if (!timeCounter) {
              bgCol.push(
                <div
                  class={gridBox_CSS_STR + " text-center font-bold"}
                  style={{
                    gridRowStart: normalized_i + 1,
                    gridRowEnd: normalized_i + 4, // Span 3 rows
                    width: MOBILE_TIME_WIDTH
                  }}
                >
                  {time}
                </div>
              );
              timeCounter += 2;
            } else {
              bgCol.push(
                <div
                  class={isLineBorder + " text-center font-bold"}
                  style={{
                    gridRowStart: normalized_i + 1,
                    gridRowEnd: normalized_i + 2, // Span 3 rows
                    width: MOBILE_TIME_WIDTH
                  }}
                ></div>
              );
              timeCounter--;
            }
          } else if (depth === 0) {
            //! Adding DAYs OF THE WEEK
  
            let w = "150vw";
  
            bgCol.push(
              <span
                class={titleBox_CSS_STR}
                style={{
                  gridRowStart: i + 1,
                  gridRowEnd: i + 2,
                  textAlign: "center",
                  height: "3.5vh",
                  width: w,
                }}
              >
                {wI === 0
                  ? ""
                  : calendarView[wI - 1]
                  ? formatDateToCalendarView(calendarView[wI - 1].date, 1)
                  : ""}
                <br />
                {weekdays[wI]}
              </span>
            );
          } else {
            //! Regular Background Cell
  
            const moduloClass =
              i % THIRTY_FRAC_DENOM === 0 ? gridBoxT_CSS_STR : gridBox_CSS_STR;
  
            bgCol.push(
              <div
                class={moduloClass}
                style={{
                  gridRowStart: i + 1,
                  gridRowEnd: i + 2,
                }}
              ></div>
            );
          }
  
          depth++; //To Maintain the Header's spacing
        }
  
        bg.push(<div style={{ gridRowStart: 1 }}>{bgCol}</div>);
      }

      return bg;
}