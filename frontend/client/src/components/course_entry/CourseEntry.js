import React from 'react'

//React Components
import CourseSearchWidget from './CourseSearchWidget'

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { assertPush, assertDelete } from '../../redux/features/courseEntrySlice';


const CourseEntry = ({reduxReference}) => {
  
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
    let dump = [];

    for(const savedEntry of savedEntries) {
        dump.push(
            <div className="bg-blue-200 rounded-lg p-4 mb-3 dark:bg-gray-900 dark:text-gray-200" key={dump.length}> {/*So react can shutup about key warning*/}
              <div className="grid grid-cols-6">
              {/* COL 1 */}
              <div className="col-start-1 r_font">
                <span className="sub_title">{savedEntry.course_code}</span><br></br>
                {savedEntry.class_type}
              </div>

              {/* COL 2 */}
              <div className="col-start-2 r_font"> <span className="font-bold">CRN:</span> {savedEntry.course_crn}     </div>  
              {/* COL 3 */}
              <div className="col-start-3 r_font">{savedEntry.course_title}</div>                

              {/* COL 6 */}
              <button className="col-start-6 large_blue_btn" onClick={() => {ReduxDeleteCourse(savedEntry.course_data_id)}}>
                    Delete
              </button>

              </div>
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