import React from 'react'

//Local Imports:
import ENDPOINT from '../../util/API';

const AddCourseEntry = ({callback, reference, index, configName, singleton, cssExtra}) => {

  //Prop breakdown

  //? cssExtra :: {"wrapper" : str, "cc" : str , "crn" : str, "button" : str } or null
  //? singleton :: "cc" or "crn" or null 

  const [vis, setVis] = React.useState(true);
  const courseCode = React.useRef('');  
  const crnCode = React.useRef('');  

  //Suggested Course Codes State:

  const [searchTerm, setSearchTerm] = React.useState('')
  const [searchResults, setSearchResults] = React.useState([]);

  const getCourseSuggestions = async () => {
    console.log(configName);

    const searchStr = courseCode.current.value;

    if(searchStr == ""){
      setSearchResults([]);
      return;
    }

    //Tell user search query is loading:

    const loading = searchStr + " Loading..."

    setSearchResults(
      [
        <option value={loading} key={0}/>
      ]
    )

    let reqBody = {
      "search_str": searchStr,
      "max_search_results": 10
    }


    const RESPONSE = await fetch(ENDPOINT + 'search/coursecode?config_name='+configName, {
      method: 'POST' , 
      headers: {'Content-Type' : 'application/json'} , 
      body : JSON.stringify(reqBody) 
      }
    );

    console.log(RESPONSE.body);

    if(RESPONSE.status === 200){
      
      const decoded = await RESPONSE.json();

      //Check that result isn't hyperspecific (Like ELEE2790U)
      //If there is only 1 result, then it's hyper specific

      if(decoded.length === 1){
        setSearchResults([]);
        return;
      }

      let suggestedDump = [];

      for(const e of decoded){
        console.log(e);
        suggestedDump.push(
          <option value={e} key={e}/>
        )
      }

      setSearchResults(suggestedDump);


    }

  }

  React.useEffect(() => {

    if(singleton !== 'crn'){

      const delayDebounceFn = setTimeout(() => {
        getCourseSuggestions();
      }, 1000)

      return () => clearTimeout(delayDebounceFn)

    }

  }, [searchTerm])


  const generateCSS = () => {
    
    const conStyle = { //Constant Style, will always be on the element
      wrapper : '', cc : '', crn : '', button : ''
    }

    if(cssExtra === undefined || !cssExtra){ //If cssExtra prop wasn't passed over
      return conStyle;
    }


    return {
      wrapper : cssExtra.wrapper + conStyle.wrapper,
      cc :      cssExtra.cc + conStyle.cc,
      crn :     cssExtra.crn + conStyle.crn,
      button :  cssExtra.button + conStyle.button
    }

  }
  const css = generateCSS();


  const SaveCourseEntry = () => {
    callback({
      "crn" : crnCode.current.value,
      "cc" : courseCode.current.value,
      "type" : false,
      "index" : index,
      "reference" : reference
    });
  }

  const enterCC = (event) => {
    if(event.key === "Enter") {
      SaveCourseEntry();
      setVis(false);
    }
  }


  //? Return 
  return (
    (vis) ? (
    <div className={css.wrapper}> {/*WRAPPER DIV*/}
    
    {( singleton === "cc" || !singleton ) ? (<>

      <input list={"course_suggest_"+index}
              ref={courseCode} 
              placeholder='Course Code (e.g: MATH1010U)' 
              className={css.cc}
              onChange={(e) => {setSearchTerm(e.target.value)}}   
              onKeyDown={(e) => {enterCC(e)}} 
        />


        <datalist id={"course_suggest_"+index}>

          {searchResults}

        </datalist>
    
    </>) : ""}

    {/* CRN SECTION */}

    {( singleton === "crn" || !singleton ) ? (<>
        <input ref={crnCode} placeholder='CRN Code(s) (e.g: 10023, 10024, 10025)' className={css.crn}></input>
    </>) : ""}

    {/* Button Submit SECTION */}

        <button className={css.button} onClick={ () => {
            console.log(index);
            SaveCourseEntry();
            setVis(false);
        }}> 
        OK </button>
    

    </div> 
    ) : '' 
  )
}

export default AddCourseEntry