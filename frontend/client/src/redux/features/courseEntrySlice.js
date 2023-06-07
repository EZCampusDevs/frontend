import { createSlice } from "@reduxjs/toolkit";

//Redux console logger
import { reduxVoid } from "../../util/logger";

const initialState = {
    ics_dl_entries : [],
    optimizer_cc_singleton_entries : [],
    crn_settings_entries : [],
    executive_calendar_cc_singleton : [],
    executive_calendar_crn_singleton : [],
}

const getState = (reference, state) => {
    switch(reference) {
        case 'optimizer_cc_singleton_entries':
            return state.optimizer_cc_singleton_entries;
        case 'ics_dl' : 
            return state.ics_dl_entries;
        default:
            break;  
    }
}




const switchDelete = (reference, state, index) => {
    switch(reference) {
        case 'optimizer_cc_singleton':
            state.optimizer_cc_singleton_entries.splice(index, 1);
            break;
        case 'ics_dl' :
            state.ics_dl_entries.splice(index, 1);
            break;
        case 'crn_settings' :
            state.crn_settings_entries.splice(index, 1);
            break;
        case 'executive_calendar_cc_singleton' :
            state.executive_calendar_cc_singleton.splice(index, 1);
            break;
        case 'executive_calendar_crn_singleton' :
            state.executive_calendar_crn_singleton.splice(index, 1);
            break;
        default:
            break;
    }
}


export const courseEntrySlice = createSlice(
    {
        name: 'courseEntry',
        initialState,
        reducers : {
            assertPush: (state,action) => {
                //Getting the specific state based on reference
                let instance_state = getState(action.payload.reference, state);

                const incomingCDI = action.payload.payload.course_data_id;

                //Check for duplicates, Return early if there is..
            
                for(let i = 0; i < instance_state.length; i++){
                    if(instance_state[i].course_data_id === incomingCDI){
                        reduxVoid("This Course_Data Entry is already appended.");
                        return; 
                    }
                }

                instance_state.push(action.payload.payload);

            },

            assertDelete: (state, action) => {
                //Getting the specific state based on reference
                let instance_state = getState(action.payload.reference, state);

                const incomingCDI = action.payload.course_data_id; // (Integer Value)

                //Delete specific CDI
                for(let i = 0; i < instance_state.length; i++){
                    if(instance_state[i].course_data_id === incomingCDI){
                        instance_state.splice(i,1)
                        return; 
                    }
                }

                
            },

            assertSet: (state, action) => {
                
                let instance_state = getState(action.payload.reference, state);
                instance_state = action.payload.payload;
            }

        }

    }
);

export const { assertPush, assertDelete , assertSet } = courseEntrySlice.actions;

export default courseEntrySlice.reducer;