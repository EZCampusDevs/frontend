import React from "react";

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];


export function weekDays () {return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}

export function timeFormat  (timeStr) {
    let z = timeStr.split(':');
    return String(parseInt( ( z[0] > 12 ) ? z[0]-12 : z[0] )) + ':'+z[1]+ ( (z[0] > 12) ? ' PM' : ' AM' )
  } 

export function dateFormat (dateObj) {
    return monthNames[dateObj.getMonth()].substring(0, 3)+' '+dateObj.getDate()+' , '+(dateObj.getYear()+1900);
}

export function duration (end,start) {
    let eF = end.split(':');
    let sF = start.split(':');

    let d = [
      ( parseInt(eF[0]) - parseInt(sF[0]) ) , 
      ( parseInt(eF[1]) - parseInt(sF[1]) ) ,
      ( parseInt(eF[2]) - parseInt(sF[2]) )
    ]

    let durationMin = d[0]* 60 + d[1];

    return ( 
      
      String(
        ( (Math.floor(durationMin/60)) !== 0) ?
        `${Math.floor(durationMin/60)} hour(s) ` :
        ``
      ) 
     +
      String(
        ( (durationMin % 60) !== 0 ) ?
        `${(durationMin % 60)} minute(s) ` : ``
      )

    )

}

// Converts locale string 11/8/2022 -> 2022-11-8
export function locale2apiFormat (locale) {
  let localeArr = locale.split('/');
  return `${localeArr[2]}-${localeArr[0]}-${localeArr[1]}`;
  
}

export function apiFormat2date (apiStr) {
  let localeArr = apiStr.split('-'); // yyyy-mm-dd
  let ret = new Date();
  ret.setFullYear(parseInt(localeArr[0]) , parseInt(localeArr[1])-1, parseInt(localeArr[2]) )
  return ret;
}

  // HH:MM:SS -> Time in milliseconds 01:30:00 -> 1 * 60^2 + 30*60 + 00 = 3600+1800+0 ~ 5400 ms
export function timeStr2Unix (timeStr) {
    
    let intTime = (timeStr.split(':') ).map(e => {return parseInt(e)});

    for(let j = 0; j < 3; j++){
      intTime[j] = intTime[j] * 60 ** (2-j);
    }

    return ( intTime[0] + intTime[1] + intTime[2] ) * 1000 //Return in Unix ( milliseconds )
  }

export function getCourseCodeFromTitle (cc) {
    
    //?cc currently looks like this: Example Course (EXMPL1234)

    cc = cc.split("").reverse().join(""); //Reverse the string

    cc = cc.split(" ")[0].trim().slice(1, -1); //grab the first (last) element )REVERSEDCODE( and remove the brackets

    return cc.split("").reverse().join(""); //Un reverse & Return
}

export function removeNoneInArray(entry) {
  let cleaned = []

  //Filter just wasn't working properly...

  for(const element of entry){

    if(element === '' || element === null){
      continue;
    }

    cleaned.push(element);

  }

  return cleaned
}

export function clean2D(entry) {
    return entry.map(e => {return e[0]});
}

const int2timeStr = (integer) => {

  if(integer < 10){
    return '0'+String(integer)+":00:00";
  }

  return String(integer)+":00:00";

}


export function decode_OptimizeCalendar_2_API( entry ) {
  let cleaned = [];

  for(let j = 0; j < entry.length; j++){
    
  // This is the key/value obj
    const element = entry[j];

    const keys = Object.keys(element);

    //Index thru keys
    for(let i = 0; i < keys.length; i++){

      //If element is false, pass over
        if(element[keys[i]] === false ){
          continue;
        }
        
      //If element is true, nest for loop to find the time block   
        if(element[keys[i]] === true){

          //Iterate from i to index where value of key is false
          for(let k = i; k < keys.length; k++){
            if(element[keys[k]] === true && !element[keys[k+1]] ){
                
              cleaned.push([ j , 
                  int2timeStr( parseInt(keys[i]) ) , int2timeStr( parseInt(keys[k]) + 1 ) ]);
              i = k;
              break;
            }
          }
        }
    }
  }
  return cleaned;
}


export function cleanInputArray(arr, type){
  let jsx = [];

  for(const entry of arr){
    
    const input = entry[0];

    if(input){

    //Array type assertion

      if(type === "string"){

        jsx.push(String(input));

      } else if (type === "integer") {

        jsx.push(parseInt(input));

      }

    }
  }

  return jsx
}

export function restrictionCleaner(obj){

  const keys = Object.keys(obj);
  let newObj = {};

  for(const key of keys){

    let keyArr = [];

    for(let i = 0; i < obj[key].length; i++) {
      const entry = obj[key][i];

      if(entry[1]){
        keyArr.push(entry[0]);
      }
    }

    if(keyArr.length){
      newObj[key] = keyArr;
    }

  }
  
  return newObj;

}

export function weekArrayFill(week){

  //If the week's the right length, don't do anything:
  if(week.length === 7){
    return week;
  }

  if(week.length < 7){

    const weekClone = [ ...week ]

    for(let i = 0; i < (7-weekClone.length); i++ ){

      //Create new day of the week object 
      let dow = { "date": null, "events": [] };

      //set dow.date to 1 day forward from last entry
      dow["date"] = week[ weekClone.length+i ]["date"];

      week.push(dow);

    }

    return week;

  }


}

export function titleCropAt(string, cropAt) {
  if(string.length > cropAt) {
    return string.slice(0, cropAt)+"...";
  }
  return string
}

export function titleScale(width, threshold, id, string) {

  if(width > threshold){
    return titleCropAt(string, 30);
  }

  let abbreviation = string.trim()[0];

  for(let i = 0; i < string.length; i++){

    //Check
    // if char got a space infront of it
    // and if character is Ascii CAPITAL A - Z or is an amperstand char 

    if(
      string[i] === " " 
      && 
      ( ( string.charCodeAt(i+1) >= 65 
        && string.charCodeAt(i+1) <= 90 ) 
        || 
      string[i+1] === '&'  )
    ) 
    {
    
      let threeSlice = string.slice(i, i+4);

      if(["LEC", "TUT" , "LAB"].includes(threeSlice.trim())){
        abbreviation += " "+threeSlice;
      } else {
        abbreviation += string[i+1];
      }

    
    }
  }

   return <span id={id} className="mobile_calendar_title" >{abbreviation}</span>

}

//Takes in string like "rgb(255,100,59)" and outputs an Array of 3 integers; r,g,b
export function rgbParser(rgbString){
  return rgbString.slice(4).trim().split(",").map(n => parseInt(n));
}

export function getDisplayMonthYear(currentWeek) {

  let uniqueYears =  [];
  let uniqueMonths = [];

  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  for(let y = 0; y < 7; y++){


    if(currentWeek[y]){ //Make sure currentWeek[y] isn't null

      let parsedDate; // [ year, month, day ] as an integer list
  //date format: yyyy-mm-dd
      const dateSplit = currentWeek[y].date.split('-');
      parsedDate = dateSplit.map(x => parseInt(x));

      if(uniqueYears.includes(parsedDate[0]) === false){
        uniqueYears.push(parsedDate[0]);
      }

      if(uniqueMonths.includes(parsedDate[1]) === false){
        uniqueMonths.push(parsedDate[1]);
      }

    } 

    continue;
  }
  

  //There shouldn't ever be more than 2 unique years, and 2 unique months
  
  //? POSSIBLE CASES :

  //? If the entire week falls in the same month, Example: December 2022

  if(uniqueMonths.length === 1 && uniqueYears.length === 1){
    return monthNames[uniqueMonths[0]-1] + " " + uniqueYears[0];
  }

  //? If the week falls in 2 different months, and these months are in the same year Example: November - December 2022

  if(uniqueMonths.length === 2 && uniqueYears.length === 1){
    return monthNames[uniqueMonths[0]-1] + " - "+ monthNames[uniqueMonths[1]-1] + " " + uniqueYears[0];
  }

  //? If the week falls in 2 different months and falls in 2 different years, Example: December 2022 - January 2023

  if(uniqueMonths.length === 2 && uniqueYears.length === 2){
    return monthNames[uniqueMonths[0]-1] +' ' + uniqueYears[0] + " - "+ monthNames[uniqueMonths[1]-1] + " " + uniqueYears[1];
  }


}

export function getDayOfWeek(currentDate) {

  // date format: yyyy-mm-dd

  let date = new Date(currentDate);
  let offset_date =  new Date(date.getTime() + 86400000);
  
  let days = ["Sunday" , "Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"];

  return days[offset_date.getDay()];
}

export function getDateDiff(inDays, start, end){ //inDays: int of days, else: String

  const startParsed = new Date(start);
  const endParsed = new Date(end);

  const diffTime = endParsed - startParsed;
  console.log(diffTime);

  //Parsing on same day
  if(diffTime == 0) {
    return 0;
  }

  if(diffTime > 0){
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  }

  return -1;
  
}

