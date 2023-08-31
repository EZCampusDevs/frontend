import React from 'react';
import { iconBuilder, profIcon, locIconBuilder, classTypeIcon } from '../../util/reactHelper';

const CourseSearchResultEntry = ({ entry, AddCourseCallback }) => {

  //Deconstructing the Entry a bit:

  let extra = entry.extra;
  const building = extra[0] ? extra[0].building_description : '';
  
    let instructors = [];

  if(entry.instructors[0]){
        for(const instructor of entry.instructors) {
            instructors.push( profIcon(instructor.instructor_name) );
        }
  }

  const renderAddBTN = () => {

    if(!entry.is_saved) {
      return (
        <button className="widget_btn" onClick={() => { AddCourseCallback(entry) }}>
        <svg
          clipRule="evenodd"
          fill="#FFFFFF"
          className="w-6"
          fillRule="evenodd"
          strokeLinejoin="round"
          strokeMiterlimit="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m12.002 2c5.518 0 9.998 4.48 9.998 9.998 0 5.517-4.48 9.997-9.998 9.997-5.517 0-9.997-4.48-9.997-9.997 0-5.518 4.48-9.998 9.997-9.998zm-.747 9.25h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
            fillRule="nonzero"
          />
        </svg>
        <span className="ml-3">Add Course</span>
      </button>
      );
    } else {
      return(<>
        <div className="flex items-center text-lime-500"> {/* Add text-lime-500 for lime green text */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 stroke-current"> {/* Add stroke-current to apply the text color to the SVG stroke */}
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="ml-3">Already Added!</span>
        </div>
      </>
      );
    }



  }


  return (
    <div className={"search_entry grid grid-cols-2 gap-4 r_font "+entry.class_type}>
    
    {/* COLUMN 1 */}
      <div>
        <p className="text-2xl font-semibold mb-2">{entry.course_title}</p>
        <p className="text-lg mb-2">CRN: {entry.course_crn}</p>
        <p className="text-lg mb-2">{entry.course_desc}</p>
      </div>

    {/* COLUMN 2 */}
      <div>
      <p className="text-xl font-bold mb-2">{entry.course_code}</p>

      {/* More Icons: */}

      {locIconBuilder(building)}
      {classTypeIcon(entry.class_type)}
      {instructors.length ? instructors : ""}

      </div>


      {/* ADD COURSE BTN */}
      {renderAddBTN()}


    </div>
  );
};

export default CourseSearchResultEntry;
