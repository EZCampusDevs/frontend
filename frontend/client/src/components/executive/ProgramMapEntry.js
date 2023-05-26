import React from 'react'

const ProgramMapEntry = ({programMap, index, add}) => {

  const renderCourseBadges = () => {

    //Badge Rendering constants:
    const nCols   = 5; //Number of columns (entries in 1 row)
    const maxRows = 3; //Max number of rows

    //const courseCodes = programMap.course_codes; 
    const manifest = programMap.manifest_list;
    
    let dump = [];

    for(let i = 0; i < manifest.length; i++){

        //Assert Render cutoff
        if( i > nCols*maxRows-1 ) {
          dump.push(<div style={{color: "lightblue"}}>And more...</div>);
          return dump;
        }

        let badgeCss = "executive_course_code_badge";

        //If manifest[i] is 9 chars long, most likely a course code (ELEE2790U , MATH1020U)
        if(manifest[i].length !== 9) {
          badgeCss += " abstracted";
        }

        dump.push(<div className={badgeCss}>
            {manifest[i]}
        </div>)
    }

    return dump;
  }  

  return (
    <div className="executive_program_map_entry">
    {/* End of input tag */}
    <div className="executive_search_side_by_side">

    <div className="executive_search_left_side"> 
    
    <span style={{color: "white" , fontSize : "12pt"}}>{programMap.name}</span>  
    {/* This is the horizontal line under the program map name */}
    <hr size="4" width="90%"/>

    <div className="simple_side_by_side">

    <div>
    <div className="property_name">Description:</div>
    {programMap.description}

    </div>

    <div>
    <div className="property_name">Category:</div>
    {programMap.category} <br/> 
    <div className="property_name" style={{marginTop: "1vh"}}>Extra:</div>
    YR. {programMap.year} SEM. {programMap.semester} <br/>
    KW: "{programMap.semester_keyword}"
    </div>


    </div>

    </div>
    <div className="executive_course_code_badge_wrapper"> {renderCourseBadges()} </div>
    </div>
    <button className="btn btn-warning bz" onClick={() => { add(index); }}>Add this entry to your selection</button>
  </div>
  )
}

export default ProgramMapEntry