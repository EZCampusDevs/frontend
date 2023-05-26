import React from 'react'

const SavedCourseEntry = ({crn, cc, index, callback, reduxRef, flavor}) => {

  const generateFlavor = () => {

    if(flavor === "cc_single") {
      return (<div className="adv_prop_cc_single">

      <div>
        Course Code: <b style ={{fontSize : '14pt'}}>{cc}</b> 
      </div>

    <button className="btn btn-danger" onClick={() => {
          callback({ "index" : index, "reference" : reduxRef});
    }}>
      Delete
    </button>

      </div> );
    }

    //ICS page Flavor (IcsPage.js component)
    if(flavor === "ics"){
      return (
        <div className="ics_thr_container">
        
          <div className="ics_vamper">
            <b>Course Code:</b> {cc || "None"} - <b>CRN:</b> {crn} 

          <button className="btn btn-danger ics_d_btn" onClick={() => {
          callback({ "index" : index, "reference" : reduxRef});
          console.log("DELETING INDEX >>> "+index);
          }}>
            Delete
          </button>
        
          </div>
        </div>
      );
    }

  //* The Null A.K.A default flavor of this component (vanilla)
      return (
        <div className="info_title" style={{"color" : "black", "fontSize" : "1vw"}}>CC: {cc || "None"} - CRN: {crn} 
        <span style={{"marginLeft" : "1vw"}}> </span>
        <button className="btn btn-danger" onClick={() => {
          callback({ "index" : index, "reference" : reduxRef});
          console.log("DELETING INDEX >>> "+index);
        }}>Delete</button>
        </div>
      );

  }

  return(generateFlavor())

}

export default SavedCourseEntry