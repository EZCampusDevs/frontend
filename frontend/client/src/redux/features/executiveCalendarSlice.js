import { createSlice } from "@reduxjs/toolkit";

//Redux logger
import { reduxVoid } from "../../util/logger";

const initialState = {
    //Actual Calendar State (For the GUI Calendar)
    data : {},
    offset : 0,
    current : {},

    //Selected Cell States 
    selected_day : null, //*Day Object or Null
    selected_time : null //*Time String or Null
}

export const executiveCalendarReducer = createSlice(
    {
        name: 'executiveCalendarEdit',
        initialState,
        reducers: {

        // VISUAL EXEC. CALENDAR REDUCERS 

            reset: (state, action) => {
                state.data = action.payload.new_data;
            },

            generateCurrent: (state) => { //This method uses the state's offset & raw data to generate a serialized current calendar state

                const offset = state.offset;
                const data = state.data;

                let week = data.days.slice(7*offset, 7*(offset+1) ); //Gets a 7 day interval based on offset

                //Serial the data into 7 objects of corresponding data
                for(let i = 0; i < week.length; i++){
                    const day = week[i];

                    week[i] = {
                        "date" : day,
                        "times" : state.data.availabilities_by_time[day],
                        "extra" : state.data.availabilities_by_day[day],
                    };
                }

                state.current = week;
            },

            forward: (state) => {

                let page_max = Math.ceil( ( state.data.days.length ) / 7 ) - 1;

                if(state.offset === page_max){
                    return;
                }

                state.offset++;

            },

            backward: (state) => {

                if(state.offset > 0){
                    state.offset--;
                }

            },
        
        // SELECTED CELL REDUCERS
        
            resetSelectedCell : (state, action) => {
                state.selected_day = action.payload.new_day;
                state.selected_time = action.payload.new_time;
            }



        }
    }
);

export const {reset, generateCurrent, forward, backward, resetSelectedCell} = executiveCalendarReducer.actions;

export default executiveCalendarReducer.reducer;