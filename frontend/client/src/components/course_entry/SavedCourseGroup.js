import React from 'react'
import { classTypeIcon } from '../../util/reactHelper';


const SavedCourseGroup = ({Gindex, courseCode, entries, ReduxDeleteCourse, iconBuilder}) => {

  const [isOpen, setOpen] = React.useState(true);

  const ccStr = courseCode + " (" + entries.length + ')';

  return (
    <>
    {isOpen ? 
      <div className="course_group" key={Gindex}>
      <h3 className="sub_title" style={{ cursor: "pointer" }} onClick={()=>{ setOpen(false);}} >
        {iconBuilder(  
        <svg 
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
        </svg>, 
        ccStr)}
        
        </h3> {/* title for each group */}
    
    {/* ENTRY MAPPING WITHIN GROUP */}
    
    {entries.map((entry, index) => (
        <div className={"saved_entry bg-blue-200"} key={index}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* COL 1 */}
            <div className="md:col-start-1 r_font">
              <span className="sub_title">{entry.course_code}</span><br></br>
              {classTypeIcon(entry.class_type)}
            </div>
  
            {/* COL 2 */}
            <div className="md:col-start-2 r_font"> 
              <span className="font-bold">CRN:</span> {entry.course_crn}
            </div>  
  
            {/* COL 3 */}
            <div className="md:col-start-3 r_font">{entry.course_title}</div>                
  
            {/* COL 6 */}
            <button className="md:col-start-6 large_red_btn" onClick={() => {ReduxDeleteCourse(entry.course_data_id)}}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>

    :
    
    <div>
            <h3 style={{ cursor: "pointer" }} className="sub_title" onClick={() => {setOpen(true);}}>
        {iconBuilder(  
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
</svg>
, 
ccStr)}
  </h3>
    </div>
    }
    </>


  )
}

export default SavedCourseGroup