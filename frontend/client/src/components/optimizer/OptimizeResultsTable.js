import React from 'react'

const OptimizeResultsTable = ({crns, simple_manifest}) => {
  
  //? crns & simp manifest sorted 
  
  const buildCRN_showcase = () => {

    let rows = [];

  for(let i = 0; i < crns.length; i++) {

    rows.push(
      <div>CRN: {crns[i]} | For: {simple_manifest[i]}</div>
    );

  }
  return rows;

  }


  return (
    <div className="ics_config_wrap card card-body optimizer-card-extra optimizer-result-table">

      <h5>Simplified Course Manifest: </h5>
      <hr/>
      {buildCRN_showcase()}
    </div>
  )
}

export default OptimizeResultsTable