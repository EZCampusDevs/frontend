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

const switchPush = (reference, state, payload) => {
    switch(reference) {
        case 'optimizer_cc_singleton':
            state.optimizer_cc_singleton_entries.push(payload);
            break;
        case 'ics_dl' : 
            state.ics_dl_entries.push(payload);
            break;
        case 'crn_settings' :
            state.crn_settings_entries.push(payload);
            break;
        case 'executive_calendar_cc_singleton' :
            state.executive_calendar_cc_singleton.push(payload);
            break;
        case 'executive_calendar_crn_singleton' :
            state.executive_calendar_crn_singleton.push(payload);
            break;
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

const switchSet = (reference, state, payload) => {
    switch(reference) {
        case 'optimizer_cc_singleton':
            state.optimizer_cc_singleton_entries = payload;
            break;
        case 'ics_dl' : 
            state.ics_dl_entries = payload;
            break;
        case 'crn_settings' :
            state.crn_settings_entries = payload;
            break;
        case 'executive_calendar_cc_singleton' :
            state.executive_calendar_cc_singleton = payload;
            break;
        case 'executive_calendar_crn_singleton' :
            state.executive_calendar_crn_singleton = payload;
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

                //? Actions list: crn , cc (course code) , reference (state reference for redux), type (???)
                //? singleton: Is null if it's a regular entry, else the singleton will be the string of the one u wanna keep
                
                //switchPush wrapper for singletons
                const pushWrap = (reference, state, crn, cc, type, singleton) => {

                    //If it isn't a singleton entry, push regularly
                    if(!singleton){
                        switchPush(
                            reference, state, {'crn' : crn ,'cc' : cc , 'type' : type }
                        );
                    }

                    //For singleton CRN entries 
                    if(singleton === 'crn'){
                        switchPush(
                            reference, state, {'crn' : crn , 'type' : type }
                        ); 
                    }

                    //For singleton CC entries 
                    if(singleton === 'cc'){
                        switchPush(
                            reference, state, {'cc' : cc , 'type' : type }
                        );  
                    }

                }   


                //Check that CRN & CC not null
                if( !action.payload.crn && !action.payload.cc ){
                    return;
                }

                //Assert crn type, and parse the payload CRN variable
                if(!isNaN(action.payload.crn)){
                    action.payload.crn = parseInt(action.payload.crn);
                }

                //If CRN Input is NaN, parse each output (Checking multiple entries from 1 input)
                if(typeof action.payload.crn == 'string' && action.payload.crn.includes(',')){

                    for(const element of action.payload.crn.split(',')){
                        
                        //If entry is aN, push [crn,cc] pair into redux state
                        if(!isNaN(element)){

                            pushWrap(action.payload.reference, state, parseInt(element), 
                                action.payload.cc, action.payload.type, action.payload.singleton);

                        }   
                    }
                    return;
                }

                //If the CRN input wasn't a string and could be asserted as an int, default push
                
                pushWrap(action.payload.reference, state, action.payload.crn, 
                action.payload.cc, action.payload.type, action.payload.singleton);
                
            },

            assertDelete: (state, action) => {

                //? Actions list: index (so I know which func to delete)
                switchDelete( action.payload.reference , state, action.payload.index );
                
            },

            assertSet: (state, action) => {
                
                switchSet( action.payload.reference , state , action.payload.payload);
            }

        }

    }
);

export const { assertPush, assertDelete , assertSet } = courseEntrySlice.actions;

export default courseEntrySlice.reducer;