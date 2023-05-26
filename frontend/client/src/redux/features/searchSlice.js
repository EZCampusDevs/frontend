import { createSlice } from "@reduxjs/toolkit";

//Redux logger
import { reduxVoid } from "../../util/logger";

const initialState = {
    content : [],
    page : 0,
    length : 0,
    items_per_page: 6
}

export const searchSliceReducer = createSlice(
    {
        name: 'searchStorage',
        initialState,
        reducers: {

            // CRN Entries Reducers
            contentRefresh: (state, action ) => {
                state.content = action.payload.new_content;
            },

            lengthRefresh: (state, action ) => {
                state.length = action.payload.length;
            },

            pageIncrease: (state, action) => {

                if( state.page+1 < Math.ceil(state.length / state.items_per_page) ){
                    state.page++
                }

            },

            pageDecrease: (state, action) => {

                if(state.page > 0){
                  
                state.page = state.page - 1;
                }

            }



        }
    }
);

export const {contentRefresh, lengthRefresh, pageIncrease, pageDecrease} = searchSliceReducer.actions;

export default searchSliceReducer.reducer;