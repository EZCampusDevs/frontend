import { createSlice } from "@reduxjs/toolkit";

//Redux logger

const initialState = {
    ics_search_entries : { payload : [] , page : 1, results_per_page : 5}
}

const switchLoad = (reference, state, payload) => {
    switch(reference) {
        case 'ics':
            state.ics_search_entries.payload = payload;
            break;

        default:
            break;
    }
}

export const courseSearchSlice = createSlice({

    name: 'courseSearch',
    initialState,
    reducers: {

        //Resets the current state's Payload Array to a new one (Search Results Array)

        loadIn : (state, action) => {
            switchLoad(action.payload.reference, state, action.payload.payload);
        }

        //

    }

});

export const { loadIn } = courseSearchSlice.actions;

export default courseSearchSlice.reducer;