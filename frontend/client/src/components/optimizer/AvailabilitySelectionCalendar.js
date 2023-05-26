import React from 'react';
import {useEffect } from 'react';

//Redux 
import { useSelector, useDispatch } from 'react-redux'
import {edit_calendar, init_calendar} from '../../redux/features/optimizerSlice'

//Import local

import { weekDays, reduxOptimizeCalendar } from '../../util/dataFormatting';
import "../../static/css/optimize_calendar.css"
import { logVoid } from '../../util/logger';


const AvailabilitySelectionCalendar = ({start, end}) => {
  
  const calendar_state = useSelector((state) => state.optimizer.optimizer_calendar);
  const dispatch = useDispatch();


  const generateTimeColumn = () => {  

    let timeColumn = [
      <div className="oc_time" key={'WDspacer'}></div>
    ]

    for(let j = start; j < end; j++){
      //Format J into a string:
      let intervalFormat = (j > 12) ? (j-12).toString() + ':00 PM' : j.toString() + ':00 AM' ;

      //
      if(j === 12){intervalFormat="12:00 PM";}
      if(j === 24){intervalFormat="12:00 AM";}

      timeColumn.push(
        <>
          <div className="oc_top_cell" key={"tc_"+String(j)}><p className="time_text">{intervalFormat}</p></div>
          <div className="oc_bottom_cell"></div>
        </>
      )
    }
    return timeColumn;
  }  

  const interactCell = (id) => {
    let pId = id.split(",");
    pId.filter(e => parseInt(e));

    // If key is true, set it false
    if(calendar_state[pId[0]][pId[1]]){

      dispatch(
        edit_calendar({
          column : pId[0],
          key: pId[1],
          value: false
        })
      );

    } else { //If key is null or false, set it to true
      
      dispatch(
        edit_calendar({
          column : pId[0],
          key: pId[1],
          value: true
        }));
    }
  }

  const generateSelectColumns = (state) => {


    const getWeek = weekDays();
    let columns = [];

    //Generate columns
    for(let k = 0; k < 5; k++){

      let timeColumn = [
        <div className="oc_time" key={'WD'+k}>{getWeek[k]}</div>
      ];

      //Generate boxes
      for(let j = start; j < end; j++){

        //Format J into a string:
        let intervalFormat = (j > 12) ? (j-12).toString() + ':00 PM' : j.toString() + ':00 AM' ;
  
        //
        if(j === 12){intervalFormat="12:00 PM";}
        if(j === 24){intervalFormat="12:00 AM";}
        
        //Generate unique identifier (for key & id)
        const uID = String(k)+','+String(j)

        //calendar_state[ Column ][ Entry Key ]

        if( calendar_state[k][j] )
        {

          let select_class = "";

          //Generate rounded edges:
          if(!calendar_state[k][j-1]){
            select_class = "oc_top_radius";
          }
          else if(!calendar_state[k][j+1]){
            select_class = "oc_bottom_radius";
          } 

          //Generate fully rounded edges if cell is alone
          if(!calendar_state[k][j-1] && !calendar_state[k][j+1]){
            select_class = "oc_full_radius"
          }

          timeColumn.push(
            <>
              <div className={`oc_select ${select_class}`} key={uID} id={uID} onDragEnter={(e) => {interactCell(e.target.id)}} onClick={(e) => {interactCell(e.target.id)}} ></div>
              <div className="oc_select_bg_cell" key={uID+"bg"}></div>
            </>
          )
        } else {
          timeColumn.push(
            <>
              <div className="oc_select_invis" key={uID} id={uID} onDragEnter={(e) => {interactCell(e.target.id)}} onClick={(e) => {interactCell(e.target.id)}} ></div>
              <div className="oc_select_bg_cell" key={uID+"bg"}></div>
            </>
          )
        }


      }

      columns.push( <div key={"COL,"+String(k)}> {timeColumn} </div> );
    }

    return columns;

  }


  //On mount
  useEffect(() => {
      dispatch(
        init_calendar({
          startIndex : start,
          endIndex : end,
        })
      );

  }, []);

  return (
    <>
    <div className="oc_row">
      <div>{generateTimeColumn()}</div>
      {generateSelectColumns(calendar_state)}
    </div>
    </>
  );
}

export default AvailabilitySelectionCalendar