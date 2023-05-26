import React from 'react'

const GenerateTimeOptions = () => {
   
    let gen = []

    //Basically creates a formatted AM/PM time string given a military time string
    // 17:30:00 -> 5:30 PM
    const formatTime = (i, interval) => {
      return (
        (i >= 12) ? String(
          ( (i-12) === 0) ? i : (i-12)
          )+interval+' PM' : String(i)+interval+' AM'
      )
    }


    for(let i = 1; i < 24; i++){

      let hour = String(i);

      if(hour.length === 1){
        hour = '0'+hour
      }



      gen.push(
        <option value={hour+':00:00'}>{ formatTime(i, ':00')} </option> ,
        <option value={hour+':30:00'}>{ formatTime(i, ':30')} </option>
      )
    }

    //Doing last option manually:

    gen.push(
      <option value={'23:59:59'}>{ '12:00 AM'} </option>
    )

    return gen
}

export default GenerateTimeOptions