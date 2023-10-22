import { createSlice } from "@reduxjs/toolkit";

//Redux logger
import { reduxVoid } from "../../util/logger";

const initialState = {
    full_view : [], //Refers to the Entire Calendar loaded in from the backend
    view_state : 0, 
    current_offset : 0 //Current Offset to serve the user...
}

export const newCalendarSlice = createSlice(
    {
        name: 'newCalendar',
        initialState,
        reducers : {

            setParameter: (state, action) => {
                const param = action.payload.parameter;
                state[param] = action.payload.payload;
                reduxVoid("Setting Parameter : "+param);
            },

            //chatgpt generated left & right scroll fns: 

            leftScroll: (state, action) => {
                const s_size = action.payload.scroll_size;

                if (state.current_offset - s_size >= 0) {  // Ensure we don't go below 0
                    state.current_offset -= s_size;
                    reduxVoid(`Left Scroll: New offset is ${state.current_offset}`);
                }
            },
    
            rightScroll: (state, action) => {
                const s_size = action.payload.scroll_size;

                if (state.current_offset + s_size < state.full_view.length) {  // Ensure we don't exceed `full_view` length
                    state.current_offset += s_size;
                    reduxVoid(`Right Scroll: New offset is ${state.current_offset}`);
                }
            }

        }
    });

export const {setParameter, leftScroll, rightScroll} = newCalendarSlice.actions;

export default newCalendarSlice.reducer;
