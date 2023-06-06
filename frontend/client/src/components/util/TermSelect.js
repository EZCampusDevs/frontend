import React from 'react'

//Redux 
import { useSelector, useDispatch } from 'react-redux';
import { setParameter } from '../../redux/features/configSelectSlice';
import { SchoolTermRequest } from '../../util/requests';


const TermSelect = () => {

    //Redux String State Variables:
    const selectedSchool = useSelector((state) => state.configSelect.selected_school);
    const selectedTerm = useSelector((state) => state.configSelect.selected_term);

    //Redux Array<Objects> State Variables:
    const terms = useSelector((state) => state.configSelect.terms);    

    //Redux Dispatchers 

    const dispatch = useDispatch();

    const setReduxParameter = (identifier, value, type) => {
        dispatch(setParameter({
          "identifier" : identifier,
          "value" : value
        }));
      }
    
    
    //Term Options Builder

    const buildTerms = (termsArray) => {
      let dump = [];

      for(const entry of termsArray){
        dump.unshift( <option value={entry.termId}>{entry.termDescription}</option> );
      }

      return dump;
    }  


    //React UseEffect statements:

    React.useEffect( //On MOUNT
    () => {

      let schoolUniqueName = null;

      if (localStorage.getItem('school_name')) {
        // Retrieve the value of 'school_name' and store it in a constant variable
        schoolUniqueName = localStorage.getItem('school_name');
        setReduxParameter("selected_school", schoolUniqueName);
      }


        SchoolTermRequest(
          "terms", //Redux Identifier for configSelect slice
          { "school_name" : schoolUniqueName, "school_id" : null }, //API Request POST body
          setReduxParameter //callback
        );
        
    }, []
    );
  
    React.useEffect(
      () => {
        //Load in terms
      }, [terms]
    )

    return(<>
        <div className="flex items-center">
        <span className="sub_title dark:text-white"> Select Term for <span className="font-semibold">{selectedSchool} :</span> </span>   
    </div>   

    <select
        class="large_select_field"
        // defaultValue={configs[0]}
        onClick={e => {
        setReduxParameter("selected_term", e.target.value, false)}}
    >
        {buildTerms(terms)}
    </select>
    </>
  );


}



export default TermSelect