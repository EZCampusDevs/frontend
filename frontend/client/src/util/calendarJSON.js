import { logVoid, reduxVoid } from "./logger";

import { datetime, RRule, RRuleSet, rrulestr } from "rrule";

export function parseDescription(desc) {
  let lines = desc.split("\n");
  let obj = {};

  // Handle the first line
  obj["desc_name"] = lines[0].trim();

  // Iterate over the rest of the lines
  for (let i = 1; i < lines.length; i++) {
    let sublines = lines[i].split("|");

    sublines.forEach((subline) => {
      let parts = subline.trim().split(": ");
      if (parts.length < 2) return; // To ensure there's a key and value

      let key = parts[0].toLowerCase().split(" ").join("_");
      let value = parts[1].trim();

      if (value === "N/A") {
        value = null; // Convert "N/A" to null
      } else if (!isNaN(value)) {
        value = parseInt(value); // Convert numeric strings to integers
      }

      obj[key] = value;
    });
  }

  return obj;
} //chatgpt: Generated parseDescription ###

const pDateStr = (dateStart) => {
  //Turns string like "yearInt-monthInt-dayInt" into  [ yearInt , monthInt, dayInt ]
  const ret = dateStart.split("-");
  return ret.map((e) => {
    return parseInt(e);
  });
};

export function cParse2(data) {
  const rruleSet = new RRuleSet();

  let meetings = data["detail"];
  console.log(meetings);

  let eventRules = []; //List of lists of recurrence dates, every list for specific

  for (const [mI, mV] of meetings.entries()) {
    // Index, Value
    let event = { ...mV };

    console.log("EXTRACTING : " + mV.rrulejs_str);
    const eventRule = RRule.fromString(mV.rrulejs_str);

    let erall;

    if (eventRule.options.freq) {
      //If the Frequency of the Event isn't 0, get all Recurrence Dates
      erall = eventRule.all();
      console.log(erall);
    } else {
      erall = [eventRule.options.dtstart];
    }

    //Now that we've got the RRule All, let's clean up event
    delete event["rrulejs_str"];
    event["rall"] = erall;

    eventRules.push(event);
  }
  reduxVoid("EVENT RULES!");
  console.log(eventRules);

  let earliestDate = null;
  let latestDate = null;

  for (let i = 0; i < eventRules.length; i++) {
    //Ensure the "rall" array has elements before accessing them
    if (eventRules[i].rall.length > 0) {
      //Convert the date strings to Date objects for comparison
      let startDate = new Date(eventRules[i].rall[0]);
      let endDate = new Date(eventRules[i].rall[eventRules[i].rall.length - 1]);

      //& Compare the earliest date of the "rall" array with the current earliest date
      if (earliestDate === null || startDate < earliestDate) {
        earliestDate = startDate;
      }
      //& Compare the latest date of the "rall" array with the current latest date
      if (latestDate === null || endDate > latestDate) {
        latestDate = endDate;
      }
    }
  }

  //! Weird Band-aid fix I brought over from other Algo, look into this
  const endWeek = new Date(latestDate.getTime() + 6 * 86400000);

  //Got the ranges, now let's generate an everyday for in between them:
  logVoid("[First Iteration: (dateRange Object)]");
  console.log(earliestDate, latestDate);

  console.log("END WEEK: ");
  console.log(endWeek);

  let iter = 0;
  let month_ = [];
  let month_first = [];
  let month_offset = 0;
  let output = [];

  //Range builder:

  while (true) {
    if (!earliestDate || !latestDate) {
      break;
    }

    const newUnix = earliestDate.getTime() + 86400000 * iter;
    const iterDate = new Date(newUnix);
    //Current Iteration's Date

    let prevMonth;

    if (output.length !== 0) {
      const pD = output[output.length - 1]["date"];
      prevMonth = pD.getMonth();
    }

    if (prevMonth !== iterDate.getMonth()) {
      month_first.push(iter);
      month_.push(iterDate.getMonth() + 1);
    }

    let e = [];

    //1. check iterDate with All Rall dates for all Entries?
    for (const event of eventRules) {
      for (const occurrence of event.rall) {
        //chatgpt: Wrote if clause
        let occurrenceDate = new Date(occurrence);
        if (
          occurrenceDate.getFullYear() === iterDate.getFullYear() &&
          occurrenceDate.getMonth() === iterDate.getMonth() &&
          occurrenceDate.getDate() === iterDate.getDate()
        ) {
          console.log("Matching event to: ");
          console.log(event);

          let appendedEvent = { ...event }; //Spread so it doesn't delete the .rall param on event
          delete appendedEvent["rall"];

          console.log(appendedEvent["name"]);
          console.log(appendedEvent["time_start"]);

          appendedEvent.description = parseDescription(
            appendedEvent.description
          );

          e.push(appendedEvent);
        }
      }
    }

    //Made the main dict keys a string (date & event), and everything in event is a declared key (easier to read for me)
    output.push({
      date: iterDate,
      events: e,
    });
    iter++;

    //Exit condition: (endWeek is also in Unix time)
    if (endWeek <= newUnix) {
      break;
    }

    //TODO: do to Unix timestamp mis-matches this emergency break usually occurs
    if (iter > 350) {
      console.log("EMERGENCY ITER BREAK!");
      break;
    }
  }

  return output;
}

export function cParse(crn_inp, cal_inp) {
  //RRGGBB Hex Codes:
  const colorHEX = [
    "#ADFF2F",
    "#728BDE",
    "#48D1CC",
    "#68B8B8",
    "#DDA0DD",
    "#FF8C00",
    "#CD5C5C",
    "#D3FFCE",
    "#ffff00",
    "#7773F3",
    "#FF71CE",
    "#01CDFE",
    "#05FFA1",
    "#B967FF",
    "#FFFB96",
  ];

  const colorHEX2 = ["#FF71CE", "#01CDFE", "#05FFA1", "#B967FF", "#FFFB96"];

  logVoid("[ cParse INPUT: ]");
  console.log(crn_inp);
  console.log(cal_inp);

  //let parsed = JSON.parse(input); //This is an array of dicts
  let CRN_input = crn_inp;
  let CAL_input = cal_inp;
  let output = [];

  //First & Last mondays
  let dateRange = {
    first: null,
    last: null,
  };

  for (let v = 0; v < 2; v++) {
    let ref;

    if (v === 0 && CRN_input && CRN_input.length) {
      ref = CRN_input;
    } else if (v === 1 && CAL_input && CAL_input.length) {
      ref = CAL_input;
    } else {
      continue;
    }

    //First pass to determine the first & last date for this calendar:
    for (const [pI, pV] of ref.entries()) {
      //Iteration thru every meeting key within every parsed entry:

      for (const [mI, mV] of pV["meetings"].entries()) {
        if (!mV) {
          continue;
        }

        let startDateList = pDateStr(mV["date_start"]); //[ yearInt , monthInt, dayInt ]
        let endDateList = pDateStr(mV["date_end"]);

        //Converting the dayInt into a monday:
        startDateList[2] = startDateList[2] - parseInt(mV["weekday_int"]);
        endDateList[2] = endDateList[2] - parseInt(mV["weekday_int"]);

        //JS counts months from 0 to 11 hence the dateList[1]-1
        const sDate = new Date(
          startDateList[0],
          startDateList[1] - 1,
          startDateList[2]
        );
        const eDate = new Date(
          endDateList[0],
          endDateList[1] - 1,
          endDateList[2]
        );

        //First
        if (dateRange.first === null || dateRange.first > sDate) {
          dateRange.first = sDate;
        }

        //Last
        if (dateRange.last === null || dateRange.last < eDate) {
          dateRange.last = eDate;
        }
      } //end of meetings loop
    }
  }

  logVoid("[First Iteration: (dateRange Object)]");
  console.log(dateRange);

  //Build out the 1D array:
  let iter = 0;
  let month_ = [];
  let month_first = [];
  let month_offset = 0;

  const endWeek = new Date(dateRange.last.getTime() + 6 * 86400000);

  while (true) {
    if (!dateRange.first || !dateRange.last) {
      break;
    }

    const newUnix = dateRange.first.getTime() + 86400000 * iter;

    const iterDate = new Date(newUnix);

    let prevMonth;

    if (output.length !== 0) {
      const pD = output[output.length - 1]["date"];
      prevMonth = pD.getMonth();
    }

    if (prevMonth !== iterDate.getMonth()) {
      month_first.push(iter);
      month_.push(iterDate.getMonth() + 1);
    }

    //Made the main dict keys a string (date & event), and everything in event is a declared key (easier to read for me)
    output.push({
      date: iterDate,
      events: [],
    });
    iter++;

    //6 days away from last monday included in date range

    //Exit condition:
    if (endWeek <= newUnix) {
      break;
    }
  }

  //Quick Fix: Check all output dates along with their +1 and see if it's the same date
  for (let j = 0; j < output.length - 1; j++) {
    if (output[j].date.getDate() === output[j + 1].date.getDate()) {
      logVoid("SPLICED @");
      console.log(output[j]);
      output.splice(j + 1, 1);
    }
  }

  const firstChange = month_first[1] - 1;
  const lastDay = output[firstChange]["date"].getDate();
  month_offset = lastDay - firstChange;

  //Add CRN events:
  if (CRN_input) {
    for (const [pJ, pK] of CRN_input.entries()) {
      //Pick a color for the entries:
      const entryColor = colorHEX[pJ];
      //Iteration thru every meeting key within every parsed entry:

      for (const [mJ, mK] of pK["meetings"].entries()) {
        //Repeat Delta isn't 0: (Meaning it's a weekly class)

        if (mK["repeat_timedelta_days"] !== 0) {
          //Parsed 'date-start' field in meeting obj

          let dateStartString = mK["date_start"];

          let dateList = pDateStr(dateStartString);

          const startDate = new Date(dateList[0], dateList[1] - 1, dateList[2]);
          // console.log([...output])

          let startIndex = null;
          let endIndex = null;

          //Find starting index by iteration:

          for (const [index, value] of output.entries()) {
            const dateCompare =
              value["date"].getFullYear() +
              "-" +
              //Ternary Operations for formatting; 1 -> '01' , 12 -> '12'
              (value["date"].getMonth() + 1 > 9
                ? (value["date"].getMonth() + 1).toString()
                : "0" + (value["date"].getMonth() + 1).toString()) +
              "-" +
              (value["date"].getDate() > 9
                ? value["date"].getDate().toString()
                : "0" + value["date"].getDate().toString());

            if (dateStartString === dateCompare) {
              //Need to compare times as unix
              startIndex = index;
            }

            if (mK["date_end"] === dateCompare) {
              endIndex = index;
            }
          }

          //Now that i've got my start:
          let classIter = 0;
          const repeatDelta = mK["repeat_timedelta_days"];

          while (true) {
            const currentEntry = output[startIndex + classIter * repeatDelta];

            if (
              !currentEntry ||
              startIndex + classIter * repeatDelta == endIndex
            ) {
              break;
            }

            //Now that we know currentEntry exists:

            //Pulling from mK & pK objs to array:

            let outputEntry = {
              event_type: "crn",
              start: mK["time_start"],
              end: mK["time_end"],
              location: mK["location"],
              title: pK["title"],
              description: parseDescription(pK["description"]),
              bg_color: entryColor,
            };

            currentEntry["events"].push(outputEntry);

            classIter++;
          }
        } else {
          //Repeat Delta is 0:

          //View start date
          let dateList = pDateStr(mK["date_start"]);

          const monthIndex = month_.indexOf(dateList[1]);

          const startDate = new Date(dateList[0], dateList[1] - 1, dateList[2]);

          let offset =
            monthIndex === 0 ? dateList[2] - month_offset : dateList[2] - 1;

          let dateIndex = month_first[monthIndex] + offset;

          let outputEntry = {
            event_type: "crn",
            start: mK["time_start"],
            end: mK["time_end"],
            location: mK["location"],
            title: pK["title"],
            description: parseDescription(pK["description"]),
            bg_color: entryColor,
          };

          output[dateIndex]["events"].push(outputEntry);
        }
      } //end of meetings loop
    }
  }

  if (CAL_input) {
    for (const [pJ, pK] of CAL_input.entries()) {
      //Pick a color for the entries:
      const entryColor = colorHEX2[pJ];
      //Iteration thru every meeting key within every parsed entry:

      for (const [mJ, mK] of pK["meetings"].entries()) {
        //Repeat Delta isn't 0: (Meaning it's a weekly class)

        if (mK["repeat_timedelta_days"] !== 0) {
          //Parsed 'date-start' field in meeting obj

          let dateStartString = mK["date_start"];

          let dateList = pDateStr(dateStartString);

          const startDate = new Date(dateList[0], dateList[1] - 1, dateList[2]);
          // console.log([...output])

          let startIndex = null;
          let endIndex = null;

          //Find starting index by iteration:

          for (const [index, value] of output.entries()) {
            const dateCompare =
              value["date"].getFullYear() +
              "-" +
              //Ternary Operations for formatting; 1 -> '01' , 12 -> '12'
              (value["date"].getMonth() + 1 > 9
                ? (value["date"].getMonth() + 1).toString()
                : "0" + (value["date"].getMonth() + 1).toString()) +
              "-" +
              (value["date"].getDate() > 9
                ? value["date"].getDate().toString()
                : "0" + value["date"].getDate().toString());

            if (dateStartString === dateCompare) {
              //Need to compare times as unix
              startIndex = index;
            }

            if (mK["date_end"] === dateCompare) {
              endIndex = index;
            }
          }

          //Now that i've got my start:
          let classIter = 0;
          const repeatDelta = mK["repeat_timedelta_days"];

          while (true) {
            const currentEntry = output[startIndex + classIter * repeatDelta];

            if (
              !currentEntry ||
              startIndex + classIter * repeatDelta == endIndex
            ) {
              break;
            }

            //Now that we know currentEntry exists:

            //Pulling from mK & pK objs to array:

            let outputEntry = {
              event_type: "club",

              title: pK["name"],
              description: pK["description"],
              uuid: pK["uuid"],
              category: pK["category"],

              time_start: mK["time_start"],
              time_end: mK["time_end"],

              date_start: mK["date_start"],
              date_end: mK["date_end"],
              event_date: currentEntry.date,

              location: mK["location"],
              is_virtual: mK["is_virtual"],
              meeting_title: mK["name"],
              meeting_description: mK["description"],

              repeat_timedelta_days: mK["repeat_timedelta_days"],

              bg_color: entryColor,
            };

            currentEntry["events"].push(outputEntry);

            classIter++;
          }
        } else {
          //Repeat Delta is 0:

          //View start date
          let dateList = pDateStr(mK["date_start"]);

          const monthIndex = month_.indexOf(dateList[1]);

          const startDate = new Date(dateList[0], dateList[1] - 1, dateList[2]);

          let offset =
            monthIndex === 0 ? dateList[2] - month_offset : dateList[2] - 1;

          let dateIndex = month_first[monthIndex] + offset;

          let outputEntry = {
            event_type: "club",

            title: pK["name"],
            description: pK["description"],
            uuid: pK["uuid"],
            category: pK["category"],

            time_start: mK["time_start"],
            time_end: mK["time_end"],

            date_start: mK["date_start"],
            date_end: mK["date_end"],

            location: mK["location"],
            is_virtual: mK["is_virtual"],
            meeting_title: mK["name"],
            meeting_description: mK["description"],

            repeat_timedelta_days: mK["repeat_timedelta_days"],

            bg_color: entryColor,
          };

          output[dateIndex]["events"].push(outputEntry);
        }
      } //end of meetings loop
    }
  }

  logVoid("[ OUTPUT OBJ (before return): ]");
  console.log(output);

  return output;
}
