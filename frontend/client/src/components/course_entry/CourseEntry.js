import React from 'react'

//React Components
import CourseSearchWidget from './CourseSearchWidget'

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { assertPush, assertDelete } from '../../redux/features/courseEntrySlice';
import SavedCourseGroup from './SavedCourseGroup';

import { iconBuilder } from '../../util/reactHelper';

const CourseEntry = ({reduxReference}) => {
  
    const C_Gs = ["bg-cyan-200" , "bg-lime-200", "bg-red-200", "bg-blue-200"];

    //& reduxKeyRef Refers to the specific sub-section of a slice i'm talking about, 
    //* This is to seperate different states using the same Reducers & Functionalities

    const dispatch = useDispatch();

    const ReduxAddCourse = (object) => {
        dispatch(assertPush({
          payload : object,
          reference : reduxReference //Example: ics_dl, or executive page
        }))
    } 

    const ReduxDeleteCourse = (int_id) => {
        dispatch(assertDelete({
          course_data_id : int_id,
          reference : reduxReference //Example: ics_dl, or executive page
        }))
    }

    //React State
    const [savedEntriesJSX, setSavedEntries] = React.useState([]);  

//TODO: Move this out and fix to generalize
  const saved_entries = useSelector((state) => state.courseEntry.ics_dl_entries);

  const savedEntriesBuilder = (savedEntries) => {
    // Group entries by course code
    const groupedEntries = savedEntries.reduce((acc, curr) => {
      (acc[curr.course_title] = acc[curr.course_title] || []).push(curr);
      return acc;
    }, {});
  


    const dump = Object.entries(groupedEntries).map(([courseCode, entries], Gindex) => (
    <SavedCourseGroup 
      Gindex={Gindex}
      courseCode={courseCode}
      entries={entries}
      ReduxDeleteCourse={ReduxDeleteCourse}
      iconBuilder={iconBuilder}
    />
    ));
  
    setSavedEntries(dump);
  }
   

  //* ========== ========== ========== ========== ==========
  //* >> React UseEffects and Return
  //* ========== ========== ========== ========== ==========

  React.useEffect(
    () => {
        savedEntriesBuilder(saved_entries);
    } , [saved_entries]
  );
  
  return (
    <>
    {savedEntriesJSX}
    <CourseSearchWidget AddCourseCallback={ReduxAddCourse}/>
    </>
  )
}

export default CourseEntry