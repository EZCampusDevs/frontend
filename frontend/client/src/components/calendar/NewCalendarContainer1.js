import React from 'react'

//React Components
import NewCalendar from './NewCalendar.js';

//Local Utility
import { CalendarPlaceholder } from '../../util/requests';
import { cParse2 } from '../../util/calendarJSON';

//Redux 
import { useSelector, useDispatch } from 'react-redux';
import { setParameter } from '../../redux/features/newCalendarSlice.js';

const NewCalendarContainer1 = () => {

    //* ========== ========== ========== ========== ==========
    //* >> REDUX DEFINITIONS & DISPATCHERS                             
    //* ========== ========== ========== ========== ==========

    const full_view = useSelector((state) => state.newCalendar.full_view);
    const current_view = useSelector((state) => state.newCalendar.current_view);

    const dispatch = useDispatch();

    const reduxSetParameter = (parameterStr, payload) => { //& PARAMETER RE-ASSIGNMENT

        dispatch(setParameter({
            parameter : parameterStr,
            payload : payload
        }));

    }

    //* ========== ========== ========== ========== ==========
    //* >> API FUNCTIONS
    //* ========== ========== ========== ========== ==========    

    const handleAPIresponse = (response) => { //Once FastAPI Calendar comes in from CDIs
        
        // Handle the response data here
        console.log(response);
        let parsedCal = cParse2(response);

        console.log("Before Serialization: ");
        console.log(parsedCal);

        const serializedParsedCal = JSON.parse(JSON.stringify(parsedCal)); //! Doing this Serializes the data, for Redux

        reduxSetParameter("full_view", serializedParsedCal); //Needs to be Seralized data
        reduxSetParameter("current_view", serializedParsedCal.slice(0,7)); //Set Current view to first 7 elements in the serialized list
    };

    const setCalendarWithCDIs = (courseDataIds) => {
        CalendarPlaceholder(courseDataIds, handleAPIresponse);
    }

    //* ========== ========== ========== ========== ==========
    //* >> ACTUAL CONTAINER UI FUNCTIONS
    //* ========== ========== ========== ========== ========== 

    const onLeftScroll = () => {

    }

    const onRightScroll = () => {

    }

    //* ========== ========== ========== ========== ==========
    //* >> REACT useEffect & return
    //* ========== ========== ========== ========== ========== 

    React.useEffect(() => {
        setCalendarWithCDIs([1,2,3]);

     }, []);

     React.useEffect(() => {

        console.log(full_view);

     }, [full_view])


    return (<>
        <button>Left {"<--"}</button>
        <button>Right {"-->"}</button>
        </>);
}

export default NewCalendarContainer1