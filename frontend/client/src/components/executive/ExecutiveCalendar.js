import React from 'react'

import ExecutiveEvent from './ExecutiveEvent';

import {timeFormat, getDisplayMonthYear, getDayOfWeek} from '../../util/dataFormatting';

import { logVoid } from '../../util/logger';

const ExecutiveCalendar = ({currentWeek, forward, backward, visualProperty}) => {


  //* REACT STATE:
  //Actual Executive Calendar JSX Columns
    const [columns,setColumns] = React.useState([]);

  //Hover state:
    const [hoverX, setHoverX] = React.useState(-1);
    const [hoverY,setHoverY] = React.useState(-1);

  //Set's the X and Y cells that the mouse is hovering over 
  //(this function is passed to <ExecutiveEvent/> as prop)
  
    const handleHover = (x,y) => {
      setHoverX(x); 
      setHoverY(y);
  }

  const generateCols = async () => {

    let generated = [];

    for(let y = 0; y < 7; y++){

      let intervals = Object.keys(currentWeek[0].times);

        if(currentWeek[y] == null){
          let blank_column = [<div className="time_cell"> N/A </div>];
          generated.push( <div>{blank_column}</div> );
          
          //Get the time delta
          for(const[index, interval] of intervals.entries()){
              
            let css_class = "dotted_cell";

            if(index % 2 == 0){
                css_class = "regular_cell";
            }
            

            //Using a whitespace character to fill the blank divs
            blank_column.push(
              <div     className={css_class+' '+index+' '+y}
                       style={{backgroundColor : "rgb(155,155,155)"}}>        
                            ‎ 
              </div>
            );              

          }

          continue;
        }

        //Generate times column if it's the first iteration
        if(y === 0){

          //Header
            let dump = [
              <div className="time_cell"> Times </div>
            ];

            //Index is representing the column of times (For each elm in the time column)
            for(const[index,interval] of intervals.entries()){

                let css_class = "dotted_cell"
                if(index % 2 === 0){
                  css_class = "regular_cell"
                }

                dump.push(<div className={css_class+' '+index}>
                    {timeFormat(interval)}
                </div>);
            }
            generated.push(<div>{dump}</div>);
        }

        //Create actual cols



        let col = [<div className="time_cell"> 
        {
          getDayOfWeek(currentWeek[y].date)
        }
        <br/>
        { // This basically gets only the date, and checks for a 0 and formats it, like "01" -> "1" and "23" -> "23"
          (currentWeek[y].date.split('-')[2][0] === '0') ? currentWeek[y].date.split('-')[2][1]: currentWeek[y].date.split('-')[2] 
        }

        </div>]

        for(const [x, value] of intervals.entries()){

            let checkHover = false;

            if(y === hoverY){
              checkHover = true;
            }

            if(x === hoverX) {
              checkHover = true;
            }

    col.push(<ExecutiveEvent 
          currentWeekDay = {currentWeek[y]}
          currentTime = {value}
          visual = {visualProperty}

          x={x} y={y} 
          hovered={checkHover}
          setHover={handleHover} 
    />);

        }

        generated.push( <div>{col}</div> );

    }
    setColumns(generated);

  }
  
  //Effects & Hooks
  React.useEffect(() => {
    generateCols()
  }, [currentWeek, hoverX, hoverY]);


  const searchResultKDwrap = (e) => {
    if(e.key === 'ArrowRight' ) { forward() }   //Next
    if(e.key === 'ArrowLeft') { backward() }  //back
  }

// {/* <div className="primary_calendar_container" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}> */}
 return (
  <div className="primary_calendar_container"
  onKeyDown={(e) => {searchResultKDwrap(e)}}
  tabIndex="0"
  >
  <div className="executive_pmap_title">{getDisplayMonthYear(currentWeek)}</div>

<div class="executive_calendar_column_wrapper">

{/*Backward button  */}
  <div className="executive_calendar_btn btn" onClick={ () => {backward()}}>  

  {/* Back arrow Icons */}
  <span class="carousel-control-prev-icon" aria-hidden="true"></span><br/><br/>
  </div>

{/* Actual Calendar Columns  */}
  <div class="columns"> {columns} </div>

{/* Forward Button */}
  <div className="executive_calendar_btn" onClick={ () => {forward()}}>  

  {/* Forward Arrow icons */}
  <span class="carousel-control-next-icon" aria-hidden="true"></span> <br/><br/>

  </div>
</div>

 </div>
  )

}

export default ExecutiveCalendar