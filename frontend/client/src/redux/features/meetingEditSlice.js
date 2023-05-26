import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    meeting_entries : [],
}

export const meetingEditSlice = createSlice({
    name: 'meetingEdit',
    initialState,
    reducers: {
        edit_entry: (state, action) => { 
            state.meeting_entries[action.payload.index] = action.payload.value;
        },
        reset: (state,action) => {
            state.meeting_entries = action.payload.new_state || [];
        }

    }
})

export const {edit_entry,reset} = meetingEditSlice.actions;

export default meetingEditSlice.reducer;