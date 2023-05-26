import { createSlice } from "@reduxjs/toolkit";
import { reduxVoid } from "../../util/logger";

const initialState = {
    request_body : {
        "config_name": "",

        "course_codes":  [],
        "required_crns": [],

        "optimizer_criteria": {
            "available_times": [],
            "available_times_weight": 0.5,
            "is_virtual": false,
            "is_virtual_weight": 0,
            "high_prof_rating": false,
            "high_prof_rating_weight": 0,
            "min_seats_open": 0,
            "min_seats_open_weight": 0,
            "max_capacity": 0,
            "max_capacity_weight": 0
        },

        "ensure_open_seats": false,
        "ensure_restrictions_met": false,
        "restrictions_met": {},
    },

    restriction_boolean : false,
    restrictions : {},

    optimizer_calendar : [ {} , {} , {} , {} , {} ] //Monday to Friday
}

export const optimizerSlice = createSlice(
    {
        name: 'optimizer',
        initialState,
        reducers: {

            splice_one: (state,action) => {
                
                console.log(action.payload.indexAt);

                state.request_body[action.payload.key].splice( action.payload.indexAt, 1 );

                if(action.payload.key === "course_codes"){
                    state.restriction_boolean = false;
                }
                
            },

            push_one: (state,action) => {
                
                state.request_body[action.payload.key].push( [ action.payload.value , action.payload.morph ] );

                if(action.payload.key === "course_codes"){
                    state.restriction_boolean = false;
                }
            },

            edit_one: (state, action) => {

                state.request_body[action.payload.key][action.payload.indexAt] =  [ action.payload.value , action.payload.morph ];

                if(action.payload.key === "course_codes"){
                    state.restriction_boolean = false;
                }

            },  

            edit_key: (state, action) => {
              
             //For indexing into nested objects and then setting attributes of attributes 
             //(Specifically in the optimizer criteria)

             //? action.payload.nest is optional
             //? action.payload.key is required

                if(action.payload.nest) {
                    state.request_body[action.payload.nest][action.payload.key] = action.payload.value;
                } else {
                    state.request_body[action.payload.key] = action.payload.value;
                }

            },

            //Restrictions Reducer(s):
            restriction_switch: (state) => {
                state.restriction_boolean = true;
            }, 

            restriction_body_interpret: (state, action) => {

                let body = {...action.payload.body.detail};

                const bodyKeys = Object.keys(body);

                //Check if redux restrictions state is empty 

                if( !state.restriction_boolean ){

                    for(let i = 0; i < bodyKeys.length; i++){
                    
                        let keyArray = body[bodyKeys[i]];
                        
                        for(let j = 0; j < keyArray.length; j++){
                            keyArray[j] = [ keyArray[j] , false ];
                        }

                        body[bodyKeys[i]] = keyArray;

                    }

                    state.restrictions = body;
                    state.restriction_boolean = true;
                    reduxVoid("Interpreted restrictions body !")
                }

            },

            restriction_body_edit: (state,action) => {
                
                console.log('trying to edit')

                const keyArray = state.restrictions[action.payload.key]

                for(let i = 0; i < keyArray.length; i++){
                    
                    if(keyArray[i][0] === action.payload.value){
                        state.restrictions[action.payload.key][i][1] = !(state.restrictions[action.payload.key][i][1]);
                    }
                    
                }

            },

            //Optimizer Calendar Reducer(s):

            edit_calendar: (state,action) => {
                state.optimizer_calendar[action.payload.column][action.payload.key] = action.payload.value
            }, 

            init_calendar: (state,action) => {
                const sI = action.payload.startIndex; 
                const eI = action.payload.endIndex;

                //For every column
                for(let x = 0; x < 5; x++){

                    //Fill every row with false
                    for(let y = sI; y < (eI-sI); y++){
                    state.optimizer_calendar[x][y] = false; 
                    }
                }
            }

        }
    }
)

export const { edit_key, edit_calendar, init_calendar, 
            restriction_body_edit, restriction_switch, restriction_body_interpret, splice_one, push_one, edit_one} = optimizerSlice.actions;

export default optimizerSlice.reducer;