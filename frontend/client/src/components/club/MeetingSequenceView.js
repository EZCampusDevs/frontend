import React from 'react'
import '../../static/css/club.css';

const MeetingSequenceView = ({start,end,interval,selected}) => {
    
  //selected view
  let selectedUnix;
    if(selected){
      selectedUnix =  selected.getTime() / 1000
    }

    //consts
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    //state
    const [ dateCrop , setDateCrop ] = React.useState(true);

    const dateFormat = (dateObj) => {
        return monthNames[dateObj.getMonth()].substring(0, 3)+' '+dateObj.getDate()+' , '+(dateObj.getYear()+1900);
    }
    const genDateSequence = (start,end,interval) => {

        if(start.getTime() === end.getTime()){
          return ["No dates to display..."]
        }

        let sequence = []
        let j = 0;
        while(true){
          console.log('MEET Sequence Iterating')
          // start time in unix seconds + (interval amount of days * integer counter)
          let newUnixSecs = ( start.getTime() / 1000 ) + (interval * j * 86400);
    
          if(newUnixSecs > ( (end.getTime() / 1000)+86400) ){
            break;
          }

          const dat = new Date(newUnixSecs*1000);



          sequence.push(<div className={ (newUnixSecs === selectedUnix) ? "info_light_selected left_align" : "info_light left_align"}> ▶ {dateFormat(dat)}</div>);

    
          j++;
          //Emergency break in-case of memory leak:
          if(j > 500){
            break;
          }
        }
        return sequence;
    } 


    const arrayDateCrop = (jsxArray, interval) => {
    
        if(jsxArray.length <= interval){
          return jsxArray
        }
    
        let crop = jsxArray.slice(0,interval);
    
        crop.push(
          <div className="info_light" style={{'text-align':'left'}}> ... etc, until : </div> ,
          jsxArray.slice(-1)
        );
    
        return crop
    
    }

  return (
    <>{
    dateCrop ?
        (
        arrayDateCrop(
        genDateSequence(start, end, parseInt(interval))  , 2
            )
        )
    :
     (
      genDateSequence(start, end, parseInt(interval))
     )
    }

    {(genDateSequence(start, end, parseInt(interval)).length > 2) ?
       (
        <button 
        className="btn btn-info btn-stretch"
        style={{
          'color': 'white',
          'marginTop' : '0.5vh'
        }}
      onClick={() => {
         setDateCrop(!dateCrop);
      
      }}>{ dateCrop ? 'Extend' : 'Crop'}</button>
      ) : ''
    }

     
   </>
  )
}

export default MeetingSequenceView