import React from 'react'

//React Components
import CourseSearchWidget from './CourseSearchWidget'

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { assertPush, assertDelete } from '../../redux/features/courseEntrySlice';


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
      (acc[curr.course_code] = acc[curr.course_code] || []).push(curr);
      return acc;
    }, {});
  
    const dump = Object.entries(groupedEntries).map(([courseCode, entries], Gindex) => (
      <div className="course_group" key={Gindex}>
        <h3 className="course_code_title">{courseCode}</h3> {/* title for each group */}
      
      {/* ENTRY MAPPING WITHIN GROUP */}
      
      {entries.map((entry, index) => (
          <div className={"saved_entry "+C_Gs[Gindex]} key={index}>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* COL 1 */}
              <div className="md:col-start-1 r_font">
                <span className="sub_title">{entry.course_code}</span><br></br>
                {entry.class_type}
              </div>
  
              {/* COL 2 */}
              <div className="md:col-start-2 r_font"> 
                <span className="font-bold">CRN:</span> {entry.course_crn}
              </div>  
  
              {/* COL 3 */}
              <div className="md:col-start-3 r_font">{entry.course_title}</div>                
  
              {/* COL 6 */}
              <button className="md:col-start-6 large_red_btn" onClick={() => {ReduxDeleteCourse(entry.course_data_id)}}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
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