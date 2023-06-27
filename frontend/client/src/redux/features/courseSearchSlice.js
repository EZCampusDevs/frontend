import { createSlice } from "@reduxjs/toolkit";

//Redux logger

const initialState = {
    ics_search_entries : { payload : [] , results_per_page : 5}
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

const getReference = (reference,state) => {
    switch(reference) {
        case 'ics':
            return state.ics_search_entries;
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

            let instance_state = getReference(action.payload.reference, state);
            instance_state.payload = action.payload.payload;

        },

        //Add onto 
        addPage: (state, action) => { //! N * M Complexity, quite bad for adding...
            
            let instance_state = getReference(action.payload.reference, state);
          
            for (const entry of action.payload.payload) {
              const isDuplicate = instance_state.payload.some(
                (existingEntry) => existingEntry.course_data_id === entry.course_data_id
              );
          
              if (!isDuplicate) {
                instance_state.payload.push(entry);
              }
            }
        }


    }

});

export const { loadIn, addPage } = courseSearchSlice.actions;

export default courseSearchSlice.reducer;