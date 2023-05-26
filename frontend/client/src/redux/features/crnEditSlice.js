import { createSlice } from "@reduxjs/toolkit";

//Redux logger
import { reduxVoid } from "../../util/logger";

const initialState = {
    crn_entries : [],
    crn_link_cache : {}
}

export const crnEditSlice = createSlice(
    {
        name: 'crnEdit',
        initialState,
        reducers: {

            // CRN Entries Reducers
            spliceOne: (state, action ) => {
                state.crn_entries.splice(action.payload.indexAt, 1);
            },
            pushOne: (state,action) => {
                state.crn_entries.push(action.payload.value);
            },
            reset: (state, action) => {
                reduxVoid('Reset crn_entries state.')
                state.crn_entries = action.payload.new_state || [];
            },

            // Link Cache
            pushKey: (state,action) => {
                reduxVoid('Pushed a key into link cache.')
                state.crn_link_cache[action.payload.key] = action.payload.value;
            }


        }
    }
);

export const {spliceOne, pushOne, reset, pushKey} = crnEditSlice.actions;

export default crnEditSlice.reducer;