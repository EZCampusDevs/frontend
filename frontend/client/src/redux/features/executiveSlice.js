import { createSlice } from "@reduxjs/toolkit";

//Redux logger
import { reduxVoid } from "../../util/logger";

const initialState = {
    request_body : {
        "config_name": "",
        "program_map_names": [],
        "course_codes": [],
        "crn_list": [],
        "date_start": "",
        "date_end": "",
        "samples_per_day": 24,
        "use_max_capacity": false
      },

    program_maps : [], // Search Term Results (Searching by Term or Config Name)
    program_maps_active : [], //Program Maps Currently Selected by User
    page : 0
}

export const executiveSliceReducer = createSlice(
    {
        name: 'executiveEdit',
        initialState,
        reducers: {


            // Request Body Reducers
            setParameter: (state, action ) => {
                console.log("@ REDUX setParameter()");
                
            //! ------ Bandaid Fix ------

                //! Sometimes the `value` is passed in as undefined-0000-00-00-undefined instead of 0000-00-00
                //! the local2apiFormat function formats it correct, something bugs it, Idk what it is...
                
                const parameter = action.payload.param;
                const value = action.payload.value;

                //!If front or back matches the BUGGED string's pattern, clean up, append the parameter and return
                if(typeof(value) === "string"
                &&    
                ( value.slice(0,10) === "undefined-" 
                ||  
                value.slice( value.length-10, value.length) === "-undefined" )
                ) { state.request_body[parameter] =  value.slice(10, value.length-10); return }

            //! ------ END of Bandaid Fix ------
                
                state.request_body[parameter] = value;
            },
            
            //Program Map Actions

            resetProgramMap: (state,action) => {
                reduxVoid("Resetting Program Maps [ExecPlanner]")
                console.log(state.program_maps)
                let raw = action.payload.raw["program_maps"]

                for(let i = 0; i < raw.length; i++){

                    raw[i].checked = false;
                   
                }

                state.program_maps = raw;
            },

            //Active Program Map Actions

            addToActiveProgramMap : (state, action) => {
                reduxVoid("Adding to Active ");
                const map_at_index = state.program_maps[action.payload.index];
                document.getElementById("error_message").innerHTML = ""; //Manual, Default DOM call 

                //Make sure this element isn't in active program map list yet:
                for(let i = 0; i < state.program_maps_active.length; i++){
                    if(state.program_maps_active[i].name === map_at_index.name){

                        //DOM Bindings to propagate Error message change:
                        const errStr = "This program map is already selected !"
                        document.getElementById("error_message").innerHTML = errStr; //Manual, Default DOM call 
                        return;
                    }
                }

                //Pushing entire object ; map_at_index
                state.program_maps_active.push(map_at_index);

                //Pushing Object's name to request body program_maps list
                state.request_body.program_map_names.push(map_at_index.name);

            },

            removeFromActiveProgramMap : (state, action) => {
                reduxVoid("Removing from Active ");

                //Remove entire object given it's index in array
                state.program_maps_active.splice(action.payload.index, 1);

                //Remove Object's name from request body at the same index
                state.request_body.program_map_names.splice(action.payload.index, 1);

            },

            setPage : (state, action) => {
                const act = action.payload.action; //act is True: Add, act is False: Remove

                //Assert going to negative pages:
                if(act === false && state.page < 1) { return; }

                state.page = state.page + 1 * (act ? 1 : -1); 

            },




        }
    }
);

export const {setParameter, resetProgramMap, addToActiveProgramMap, removeFromActiveProgramMap, setPage } = executiveSliceReducer.actions;
export default executiveSliceReducer.reducer;