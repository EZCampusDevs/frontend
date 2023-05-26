import React from 'react'

import { useSelector, useDispatch } from 'react-redux';
import { resetSelectedCell } from '../../redux/features/executiveCalendarSlice';


const ExecutiveEvent = ({ x, y, hovered, setHover, currentWeekDay, currentTime, visual}) => {

    //CONSTANT
    const DAY_TIMES = currentWeekDay.times;
    const STUDENTS_AVAILABLE = DAY_TIMES[currentTime];

    let css_class = "dotted_cell"
    if(x % 2 === 0){
      css_class = "regular_cell"
    }

    //Redux Stuff:
    const dispatch = useDispatch(); 

    const getColor = () => {

      //VALUE here refers to the amount of students available
      const COLORS = visual.colors; 

      const bound = (visual.max - visual.min) / (COLORS.length-1); //get threshold bounds
      let   bounds = [visual.min]; //set the first element of the bounds list to the minimum of students (least students free)

      for(let j = 1; j < COLORS.length-1; j++){
        bounds.push(visual.min + bound * j);
      }

      //Add the maximum (most students free)
      bounds.push(visual.max);

      //Now that bounds are there, it's very easy to select a suitable color:
      let estimated_color;

      for(let i = 1; i < bounds.length-1; i++){
        if(bounds[i-1] <= STUDENTS_AVAILABLE && bounds[i+1] >= STUDENTS_AVAILABLE){
          estimated_color = i;
        }
      }
      return hovered ? COLORS[estimated_color][1] : COLORS[estimated_color][0];

    }

    const enterHover = (event) => {
        //Parse event and obtain x , y positions
        const classString = event.target.className.split(' ');
        return setHover( parseInt(classString[1]) , parseInt(classString[2]) );
    }

    const leaveHover = () => {
        return setHover( -1 , -1 ); 
    }


  return (
   <div 
   onClick={() => {
          dispatch(resetSelectedCell({
        new_day : currentWeekDay,
        new_time : currentTime
      }));
    }}

   onMouseEnter={(e) => enterHover(e)}
   onMouseLeave={() => leaveHover() } //The method doesn't need event param for de-activation

            className={css_class+' '+x+' '+y}
            style={{backgroundColor : getColor()}}>
                
                {STUDENTS_AVAILABLE}
    </div>
  );
}

export default ExecutiveEvent