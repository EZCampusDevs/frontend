import React from 'react'
import { cookieAuthCheck } from '../../util/browserUtil';
import ENDPOINT from '../../util/API';

//Redux 
import { useSelector, useDispatch } from 'react-redux';
import { setParameter } from '../../redux/features/configSelectSlice';

import '../../static/css/main_ui.css'

const SchoolConfigSelect = () => {
  
//Redux String State Variables:
  const selectedSchool = useSelector((state) => state.configSelect.selected_school);
  const selectedTerm = useSelector((state) => state.configSelect.selected_term);

 //Redux Array<String> State Variables:
  const schools = useSelector((state) => state.configSelect.schools);
  const terms = useSelector((state) => state.configSelect.terms);

  const dispatch = useDispatch();

  const [renderState, setRenderState] = React.useState(-1);
  const [checkmark, setCheckmark]     = React.useState('');

  //? -1 : LOADING , 1 : ACTIVATED


  const setReduxParameter = (identifier, value, type) => {
    dispatch(setParameter({
      "identifier" : identifier,
      "value" : value
    }));
  }


  //*
  //* 

  const optionBuilder = (array, placeholder, topEntry) => { // IN: Array<String> -> OUT: JSX Options Array
    let dump = [];

    for(const entry of array){
      dump.unshift( <option value={entry}>{entry}</option> );
    }

    //The placeholder will act as the `topEntry` until data is filled, in which it will vanish
    if(placeholder !== null && !array.length){
      dump.unshift(placeholder);
    }

    // `topEntry` is just the permanent entry at the top, if specified
    if(topEntry !== null){
      dump.unshift(topEntry);
    }

    return dump;
  }

  const renderConfigSelect = () => {

    // If state is 0, show only school
    if(renderState === 1) {

    return(
    <div className="flex sm:flex-row flex-col r_font">
    
      {/* INSTITUTION SUBTITLE */}


    <div className="ml-0 sm:ml-10">

     {/* TERM SUBTITLE */}

        <div className="flex items-center">
          <span className="sub_title"> Select Term: </span> 
        </div>   

      <select
          class="large_select_field"
          // defaultValue={configs[0]}
          onClick={e => {
            setReduxParameter("selected_term", e.target.value, false)}}
        >
        {optionBuilder(terms, <option value="default"> Must select an institution first...</option>, null)}
        </select>
      </div>

    </div>);

    }

  }


  React.useEffect(
    () => {
        const authed = cookieAuthCheck(document.cookie, false); //Auth Token or Null
    }, []
    
  );

  React.useEffect(
    () => {
    //  getConfigs(selectedSchool);
    }, [selectedSchool]
  )

  React.useEffect(
    () => {

      if(selectedTerm){

//If a term is selected, the checkmark appears (SVG Logo)

    setCheckmark(<svg className="w-6 ml-3" 
        fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    );
      }
    }, [selectedTerm] 
  );

  

  return (renderConfigSelect()) //Render Statement of Component
}

export default SchoolConfigSelect