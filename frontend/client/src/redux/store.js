import { configureStore } from "@reduxjs/toolkit";

//Reducers 
import optimizerReducer from "./features/optimizerSlice";
import meetingEditReducer from "./features/meetingEditSlice";
import crnEditReducer from "./features/crnEditSlice";

import courseEntryReducer from './features/courseEntrySlice';

//Search
import searchSliceReducer from "./features/searchSlice";

//Executive Reducers:
import executiveCalendarReducer from "./features/executiveCalendarSlice";
import executiveSliceReducer from "./features/executiveSlice";

import newCalendarReducer from "./features/newCalendarSlice";

//School & Config Selection
import configSelectReducer from "./features/configSelectSlice";
import courseSearchReducer from "./features/courseSearchSlice";

export const store = configureStore({
    reducer : {
        optimizer : optimizerReducer,
        meetingEdit : meetingEditReducer, 
        crnEdit : crnEditReducer,
        newCalendar : newCalendarReducer,
        courseEntry : courseEntryReducer,
        searchStorage : searchSliceReducer,
        executiveCalendar : executiveCalendarReducer,
        executiveEdit : executiveSliceReducer,
        configSelect : configSelectReducer,
        courseSearch : courseSearchReducer,
    }
});