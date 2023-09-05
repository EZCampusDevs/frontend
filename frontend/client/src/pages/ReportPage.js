import React from 'react'

import {POST_Report, GETALL_TYPES_Report} from '../util/requests';

const ReportPage = () => {
  return (
    <div>
          <button onClick={() => {
                      POST_Report(1,1,1,"Testing the description..");
          }}>
            click me
          </button>

          <br/>

          <button onClick={() => {
                      GETALL_TYPES_Report("Browser");
          }}>
            click me Getall
          </button>
    </div>
  )
}

export default ReportPage