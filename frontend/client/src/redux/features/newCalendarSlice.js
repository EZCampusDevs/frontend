import { createSlice } from "@reduxjs/toolkit";

//Redux logger
import { reduxVoid } from "../../util/logger";

const initialState = {
    full_view : [],
    view_state : 0, 
    current_view : []
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
            }

        }
    });

export const {setParameter} = newCalendarSlice.actions;

export default newCalendarSlice.reducer;
