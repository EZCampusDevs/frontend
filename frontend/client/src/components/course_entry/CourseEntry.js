import React from 'react'

//React Components
import CourseSearchWidget from './CourseSearchWidget'

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { assertPush, assertDelete } from '../../redux/features/courseEntrySlice';


const CourseEntry = ({reduxKeyRef}) => {
  
    //& reduxKeyRef Refers to the specific sub-section of a slice i'm talking about, 
    //* This is to seperate different states using the same Reducers & Functionalities

    const dispatch = useDispatch();

    const ReduxAddCourse = (object) => {
        dispatch(assertPush({
          payload : object,
          reference : reduxKeyRef //Example: ics_dl, or executive page
        }))
    } 

    const ReduxDeleteCourse = (int_id) => {
        dispatch(assertDelete({
          course_data_id : int_id,
          reference : reduxKeyRef //Example: ics_dl, or executive page
        }))
    }

    //React State
    const [savedEntriesJSX, setSavedEntries] = React.useState([]);  

//TODO: Move this out and fix to generalize
  const saved_entries = useSelector((state) => state.courseEntry.ics_dl_entries);

  const savedEntriesBuilder = (savedEntries) => {
    let dump = [];

    for(const savedEntry of savedEntries) {
        dump.push(
            <div className="" key={dump.length}> {/*So react can shutup about key warning*/}

                {savedEntry.course_code}        
                {savedEntry.course_crn}

                <button className="large_blue_btn" onClick={() => {ReduxDeleteCourse(savedEntry.course_data_id)}}>
                    Delete
                    </button>                                                                            
            </div>
        )
    }

    setSavedEntries(dump);

  }    


  const addCourse = (payload) => {
    console.log("Executed add course")
    console.log(payload)
    ReduxAddCourse(payload);
  }  

  React.useEffect(
    () => {
        savedEntriesBuilder(saved_entries);
    } , [saved_entries]
  )
  
  return (
    <>
    {savedEntriesJSX}
    <CourseSearchWidget AddCourseCallback={addCourse}/>
    </>
  )
}

export default CourseEntry