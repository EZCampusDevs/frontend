import { logVoid } from "./logger";

import { datetime, RRule, RRuleSet, rrulestr } from 'rrule'


export function calendarParseDesc(stringDescription) {

    let eDescription = stringDescription.split('\n');
    let descObject = {};
    
    for(const k of eDescription){            
    //Entries of string: 

      //Split first occurance of ':' 
      const param = k.split(/:(.*)/s);

      descObject[param[0]] = param[1].trim();
    }

    return descObject;
}

const pDateStr = (dateStart) => { //Turns string like "yearInt-monthInt-dayInt" into  [ yearInt , monthInt, dayInt ]
    const ret = dateStart.split('-');
    return ret.map(e => {return parseInt(e)});
}


export function cParse2(data) {
    //First & Last mondays

    const rruleSet = new RRuleSet()

    //
    const OU_DAYS = "days(n)"
    const OU_WEEKS = "weeks(weekday)"
    const OU_MONTHS_WD = "months(nth_weekday)"
    const OU_MONTHS_N = "months(nth)" // Nth Day in Month ; E.G July 14th, June 14th
    const OU_YEARS = "years(nth)"


    let meetings = data["detail"];

    let dateRange = {
        first : null,
        last : null
    }

    for(const [mI,mV] of meetings.entries()) { // Index, Value

        if(!mV){ continue; }

        let startDateList = pDateStr(mV['date_start']); //[ yearInt , monthInt, dayInt ]
        let endDateList = pDateStr(mV['occurrence_limit']); //In RRULE, occurence_limit refers to the date end
               
        //JS counts months from 0 to 11 hence the dateList[1]-1
        const sDate = new Date(startDateList[0],(startDateList[1]-1),startDateList[2]);
        const eDate = new Date(endDateList[0],(endDateList[1]-1),endDateList[2]);

               //First
        if(dateRange.first === null || dateRange.first > sDate){
            dateRange.first = sDate;
        }

               //Last
        if(dateRange.last === null || dateRange.last < eDate){
            dateRange.last = eDate;
        }
        
    }

    //Got the ranges, now let's generate an everyday for in between them:
    logVoid('[First Iteration: (dateRange Object)]');
    console.log(dateRange);


    const rule = RRule.fromString(
        "DTSTART:20230511T131000\n"
        + "RRULE:FREQ=WEEKLY;UNTIL=20230511T160000;BYDAY=TH"
      );

    let rall = rule.all();

    console.log(rall);
}



export function cParse(crn_inp, cal_inp) {

    //RRGGBB Hex Codes:
    const colorHEX = [
       '#ADFF2F' , '#728BDE' , '#48D1CC', '#68B8B8' ,'#DDA0DD' , '#FF8C00','#CD5C5C', '#D3FFCE', '#ffff00','#7773F3',  '#FF71CE' , '#01CDFE' , '#05FFA1' , '#B967FF' , '#FFFB96'
    ]

    const colorHEX2 = [
    '#FF71CE' , '#01CDFE' , '#05FFA1' , '#B967FF' , '#FFFB96'
    ]

    logVoid('[ cParse INPUT: ]');
    console.log(crn_inp);
    console.log(cal_inp)

    //let parsed = JSON.parse(input); //This is an array of dicts
    let CRN_input = crn_inp;
    let CAL_input = cal_inp;
    let output = [];


    //First & Last mondays
    let dateRange = {
        first : null,
        last : null
    }

    for(let v = 0; v < 2; v++){

        let ref;

        if(v === 0 && CRN_input && CRN_input.length) {
            ref = CRN_input;
        } else if(v === 1 && CAL_input && CAL_input.length) {
            ref = CAL_input;
        } else {
            continue;
        }

        //First pass to determine the first & last date for this calendar:
        for(const [pI,pV] of ref.entries()){
            
            //Iteration thru every meeting key within every parsed entry:

            for(const [mI,mV] of pV['meetings'].entries()){

                if(!mV){
                    continue;
                }

                let startDateList = pDateStr(mV['date_start']); //[ yearInt , monthInt, dayInt ]
                let endDateList = pDateStr(mV['date_end']);

                //Converting the dayInt into a monday:
                startDateList[2] = startDateList[2]-parseInt(mV['weekday_int']);
                endDateList[2] = endDateList[2]-parseInt(mV['weekday_int']);

                //JS counts months from 0 to 11 hence the dateList[1]-1
                const sDate = new Date(startDateList[0],(startDateList[1]-1),startDateList[2]);
                const eDate = new Date(endDateList[0],(endDateList[1]-1),endDateList[2]);

                //First
                if(dateRange.first === null || dateRange.first > sDate){
                    dateRange.first = sDate;
                }

                //Last
                if(dateRange.last === null || dateRange.last < eDate){
                    dateRange.last = eDate;
                }

            } //end of meetings loop


        }
    

    }


    logVoid('[First Iteration: (dateRange Object)]');
    console.log(dateRange);

    //Build out the 1D array:
    let iter = 0;
    let month_ = [];
    let month_first = [];
    let month_offset = 0;

    const endWeek = new Date(
        dateRange.last.getTime()+6*86400000
    ) 

    while(true) {

        if(!dateRange.first || !dateRange.last){
            break;
        }

        const newUnix = dateRange.first.getTime()+(86400000*iter)


        const iterDate = new Date(newUnix);

        let prevMonth;

        if(output.length !== 0){
            const pD = (output[output.length-1])['date'];
            prevMonth = pD.getMonth();
        }

        if(prevMonth !== iterDate.getMonth()){
            month_first.push(iter);
            month_.push(iterDate.getMonth()+1);
        }

        //Made the main dict keys a string (date & event), and everything in event is a declared key (easier to read for me)
        output.push(
            {
                'date' : iterDate, 
                'events' : []
            }
        );
        iter++;
        

        //6 days away from last monday included in date range

        //Exit condition:
        if(endWeek <= newUnix){
            break;
        }

    }

    //Quick Fix: Check all output dates along with their +1 and see if it's the same date
    for(let j = 0; j < (output.length-1); j++){

        if(output[j].date.getDate() === output[j+1].date.getDate()){
            logVoid('SPLICED @');
            console.log(output[j])
            output.splice((j+1), 1);
        }

    }


    const firstChange = (month_first[1])-1;
    const lastDay = (output[firstChange]['date']).getDate();
    month_offset = lastDay-firstChange;

    //Add CRN events:
    if(CRN_input){
    for(const [pJ,pK] of CRN_input.entries()){

        //Pick a color for the entries: 
        const entryColor = colorHEX[pJ];
        //Iteration thru every meeting key within every parsed entry:

        for(const [mJ,mK] of pK['meetings'].entries()){
            
            //Repeat Delta isn't 0: (Meaning it's a weekly class)

            if(mK['repeat_timedelta_days'] !== 0){

                //Parsed 'date-start' field in meeting obj
                
                let dateStartString = mK['date_start'];

                let dateList = pDateStr(dateStartString);

                const startDate = new Date(dateList[0],(dateList[1]-1),dateList[2]);
                // console.log([...output])

                let startIndex = null;
                let endIndex = null;

                //Find starting index by iteration:

                for(const [index, value] of output.entries()){

                    const dateCompare = value['date'].getFullYear() + '-' + 
                    //Ternary Operations for formatting; 1 -> '01' , 12 -> '12'
                    (((value['date'].getMonth()+1) > 9) ? (value['date'].getMonth()+1).toString() : '0'+(value['date'].getMonth()+1).toString())
                    +'-'+
                    (((value['date'].getDate()) > 9) ? (value['date'].getDate()).toString() : '0'+(value['date'].getDate()).toString())

                    if(dateStartString === dateCompare){ //Need to compare times as unix
                        startIndex = index;
                    }

                    if(mK['date_end'] === dateCompare){
                        endIndex = index;
                    }
                }

                //Now that i've got my start:
                let classIter = 0;
                const repeatDelta = mK['repeat_timedelta_days'];

                while(true){
                
                    const currentEntry = output[startIndex+classIter*repeatDelta];

                    if(!currentEntry || (startIndex+classIter*repeatDelta) == endIndex){ break; }
                    

                    //Now that we know currentEntry exists:

                    //Pulling from mK & pK objs to array:

                    let outputEntry = {
                        event_type : 'crn',
                        start : mK['time_start'],
                        end : mK['time_end'],
                        location: mK['location'],
                        title: pK['title'],
                        description : calendarParseDesc(pK['description']),
                        bg_color : entryColor
                    }

                    currentEntry['events'].push(outputEntry);

                    classIter++;
                }
       
            } else { //Repeat Delta is 0:
                
                //View start date
                let dateList = pDateStr(mK['date_start']);
                
                const monthIndex = month_.indexOf(dateList[1]);

                const startDate = new Date(dateList[0],(dateList[1]-1),dateList[2]);
                
                let offset = (monthIndex === 0) ? dateList[2]-month_offset : dateList[2]-1

                let dateIndex = month_first[monthIndex]+(offset)

                let outputEntry = {
                    event_type : 'crn',
                    start : mK['time_start'],
                    end : mK['time_end'],
                    location: mK['location'],
                    title: pK['title'],
                    description : calendarParseDesc(pK['description']),
                    bg_color : entryColor
                };
            
                output[dateIndex]['events'].push(
                    outputEntry
                );

            }

        } //end of meetings loop

    }
    }
    
    if(CAL_input){
    for(const [pJ,pK] of CAL_input.entries()){

        //Pick a color for the entries: 
        const entryColor = colorHEX2[pJ];
        //Iteration thru every meeting key within every parsed entry:

        for(const [mJ,mK] of pK['meetings'].entries()){
            
            //Repeat Delta isn't 0: (Meaning it's a weekly class)

            if(mK['repeat_timedelta_days'] !== 0){

                //Parsed 'date-start' field in meeting obj
                
                let dateStartString = mK['date_start'];

                let dateList = pDateStr(dateStartString);

                const startDate = new Date(dateList[0],(dateList[1]-1),dateList[2]);
                // console.log([...output])

                let startIndex = null;
                let endIndex = null;

                //Find starting index by iteration:

                for(const [index, value] of output.entries()){

                    const dateCompare = value['date'].getFullYear() + '-' + 
                    //Ternary Operations for formatting; 1 -> '01' , 12 -> '12'
                    (((value['date'].getMonth()+1) > 9) ? (value['date'].getMonth()+1).toString() : '0'+(value['date'].getMonth()+1).toString())
                    +'-'+
                    (((value['date'].getDate()) > 9) ? (value['date'].getDate()).toString() : '0'+(value['date'].getDate()).toString())

                    if(dateStartString === dateCompare){ //Need to compare times as unix
                        startIndex = index;
                    }

                    if(mK['date_end'] === dateCompare){
                        endIndex = index;
                    }
                }


                //Now that i've got my start:
                let classIter = 0;
                const repeatDelta = mK['repeat_timedelta_days'];

                while(true){
                
                    const currentEntry = output[startIndex+classIter*repeatDelta];

                    if(!currentEntry || (startIndex+classIter*repeatDelta) == endIndex){ break; }
                    

                    //Now that we know currentEntry exists:

                    //Pulling from mK & pK objs to array:

                    let outputEntry = {

                        event_type : 'club',
    
                        title: pK['name'],
                        description : pK['description'],
                        uuid : pK["uuid"],
                        category: pK["category"],
                        
                        time_start : mK['time_start'],
                        time_end : mK['time_end'],
    
                        date_start : mK['date_start'],
                        date_end : mK['date_end'],
                        event_date : currentEntry.date,
    
                        location: mK['location'],
                        is_virtual: mK['is_virtual'],
                        meeting_title: mK['name'],
                        meeting_description: mK['description'],
    
                        repeat_timedelta_days : mK['repeat_timedelta_days'],
                        
                        bg_color : entryColor
                    }

                    currentEntry['events'].push(outputEntry);

                    classIter++;
                }
       
            } else { //Repeat Delta is 0:
                
                //View start date
                let dateList = pDateStr(mK['date_start']);
                
                const monthIndex = month_.indexOf(dateList[1]);

                const startDate = new Date(dateList[0],(dateList[1]-1),dateList[2]);
                
                let offset = (monthIndex === 0) ? dateList[2]-month_offset : dateList[2]-1

                let dateIndex = month_first[monthIndex]+(offset)

                let outputEntry = {

                    event_type : 'club',

                    title: pK['name'],
                    description : pK['description'],
                    uuid : pK["uuid"],
                    category: pK["category"],
                    
                    time_start : mK['time_start'],
                    time_end : mK['time_end'],

                    date_start : mK['date_start'],
                    date_end : mK['date_end'],

                    location: mK['location'],
                    is_virtual: mK['is_virtual'],
                    meeting_title: mK['name'],
                    meeting_description: mK['description'],

                    repeat_timedelta_days : mK['repeat_timedelta_days'],
                    
                    bg_color : entryColor
                }
            
                output[dateIndex]['events'].push(
                    outputEntry
                );

            }

        } //end of meetings loop

    }
    }

    logVoid('[ OUTPUT OBJ (before return): ]')
    console.log(output);

    return output


}

