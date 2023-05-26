import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selected_school : null,
    selected_term : null,
    schools : [], 
    terms : []
}

const switchPush = (reference, state, payload) => {
    switch(reference) {
        case 'selected_school' : 
            state.selected_school = payload;
            break;    
        case 'selected_term' : 
            state.selected_term = payload;
            break;  
        case 'schools' : 
            state.schools = payload;
            break;
        case 'terms' :
            state.terms = payload;
            break;     
        default:
            break;      
    }
}



export const configSelectSlice = createSlice(
    {
        name: 'configSelect',
        initialState,
        reducers : {

            setParameter: (state, action) => {
                //? Actions list: identifier (str) , value (str)

                const identifier = action.payload.identifier;
                let value = action.payload.value;

                //omit default string values
                if(value === "default"){
                    switchPush(identifier, state, null);
                    return;
                }

                switchPush(identifier, state, value);
            },


        }
    });

export const {setParameter} = configSelectSlice.actions;

export default configSelectSlice.reducer;
