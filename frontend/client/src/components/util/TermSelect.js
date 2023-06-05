import React from 'react'

//Redux 
import { useSelector, useDispatch } from 'react-redux';
import { setParameter } from '../../redux/features/configSelectSlice';
import { SchoolTermRequest } from '../../util/requests';


const TermSelect = () => {

    //Redux String State Variables:
    const selectedSchool = useSelector((state) => state.configSelect.selected_school);
    const selectedTerm = useSelector((state) => state.configSelect.selected_term);

    //Redux Array<String> State Variables:
    const terms = useSelector((state) => state.configSelect.terms);    

    //Redux Dispatchers 

    const dispatch = useDispatch();

    const setReduxParameter = (identifier, value, type) => {
        dispatch(setParameter({
          "identifier" : identifier,
          "value" : value
        }));
      }
    
      //React UseEffect statements:

    React.useEffect( //On MOUNT
    () => {
        SchoolTermRequest("terms", setReduxParameter);
        console.log("Success!")
    }, []
    )
  

    return(<>
        <div className="flex items-center">
        <span className="sub_title"> Select Term: </span>   
    </div>   

    <select
        class="large_select_field"
        // defaultValue={configs[0]}
        onClick={e => {
        setReduxParameter("selected_term", e.target.value, false)}}
    >
        {/* build options... */}
    </select>
    </>
  );


}



export default TermSelect