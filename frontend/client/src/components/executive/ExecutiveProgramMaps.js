import React from 'react'

//React components:
import ProgramMapEntry from './ProgramMapEntry';
import SchoolConfigSelect from '../../components/util/SchoolConfigSelect';

//Static:
import ENDPOINT from '../../util/API';

//Redux vitals
import { useSelector, useDispatch } from 'react-redux';

//Redux slices
import { setParameter, resetProgramMap, addToActiveProgramMap, removeFromActiveProgramMap, setPage } from '../../redux/features/executiveSlice';

const ExecutiveProgramMaps = ({exec_request_body, programMaps}) => {

//Redux stuff
const dispatch = useDispatch();  

const activeProgramMaps = useSelector((state) => state.executiveEdit.program_maps_active);
const pageCount = useSelector((state) => state.executiveEdit.page);
const configName = useSelector(   (state) => state.configSelect.selected_term);

//Config Select State



const setRequestBodyParameter = (param, value) => {
    dispatch(setParameter({
      "param" : param,
      "value" : value
    }));
}

//* React State:
  const [programMapsList, setProgramMaps] = React.useState([]);
  const [resultState, setResultState] = React.useState(false); //False means empty, true means populated

  const [activeProgramMapsList, setActiveProgramMaps] = React.useState([]);

  const [searchOrConfig, setSOC] = React.useState(false); //False is Config, True is Search
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const searchRef = React.useRef();

  //Searching for program_maps
  const searchProgramMaps = async (searchInput, page) => {
      setSearchTerm(searchInput);

        let requestBody = {
          "search_string": searchInput,
          "search_result_limit": 5,
          "page": page
        }
  
        const RESPONSE = await fetch(ENDPOINT + 'pmaps/search/detailed', {
          method: 'POST' , 
  //          headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token },
          headers: {'Content-Type' : 'application/json' },
          body: JSON.stringify(requestBody)
          }
        );
  
        if(RESPONSE.status === 200){
          let payload = await RESPONSE.json();
  
          dispatch(resetProgramMap({
            raw : payload,
          }));
          return;
        }
  
    }
 
  //Keydown wrapper for searching (Upon key `Enter` is pressed)
  const searchPmKDwrap = async (event, searchInput, page) => {
    if (event.key === 'Enter') {
      searchProgramMaps(searchInput, page);
    }
  }
  
  const addToActive = (index) => {

    dispatch(addToActiveProgramMap({
      "index" : index,
    }));
  }  

  const removeFromActive = (index) => {
    dispatch(removeFromActiveProgramMap({
      "index" : index,
    }));  
  }


  //Builds the list of program maps from search result

  const buildSearchedProgramMaps = () => {
    let dump = []

    //Assert the case where the search result was empty
    if(programMaps.length === 0){
      setResultState(false);
      dump.push(
        <div className="executive_white_text">
          No Results Found ...
        </div>
      );

      setProgramMaps(dump);
      return;
    }

    //Set result state to true since entries came in:
    setResultState(true);

    for(let i = 0; i < programMaps.length; i++){
      dump.push(
        <ProgramMapEntry 
          programMap={programMaps[i]} 
          index = {i}
          add = {addToActive}

        />
      );
    }

    //Push the extra "search more element"
    dump.push(<>
    <a> View more items by going to the next / last page...</a>
    </>)

    setProgramMaps(dump);
  }

  //Builds the list of active program maps (program maps currently selected by user)

  const buildActiveProgramMaps = () => {
    let dump = []

    for(let i = 0; i < activeProgramMaps.length; i++){
      const c = activeProgramMaps[i];

      //Selected Program Maps Entry:

      dump.push(<div className="executive_selected_program_map_entry">
      <span style={{color: "white"}}> {c.name} </span>  
      <span> {c.category}  </span>
      <span> Year {c.year}, Semester {c.semester}  </span>

      <button style={{marginTop: "0.5vh"}}class="btn btn-danger" onClick={() => {removeFromActive(i)}}>Delete</button> <br/>
      </div>
      )

    }

    setActiveProgramMaps(dump);
  }

  //View search results back & forth Keydown wrappers 
  //(So user can use left & right arrow keys to scroll thru PMAP search results )
  const searchResultKDwrap = (e) => {
    if(e.key === 'ArrowRight' ) { dispatch(setPage({"action" : true})) }   //Next
    if(e.key === 'ArrowLeft') { dispatch(setPage({"action" : false})) }  //back
  }

  //React Hooks & Effects
  //Search Program Maps Trigger 
  React.useEffect(
    () => {
      buildSearchedProgramMaps();
    }, [programMaps]
  );

  React.useEffect(
    () => {
      searchProgramMaps(searchTerm, pageCount);
    }, [pageCount]
  )

  //Active Program Maps Update Trigger
  React.useEffect(
    () => {
      buildActiveProgramMaps();
    }, [activeProgramMaps]
  );

  React.useEffect(
    () => {
      setRequestBodyParameter("config_name" , configName)
    }, [configName]
  );

  React.useEffect(
    () => {
      if(exec_request_body.config_name !== ""){
      }
    }, []
  );

  return (
<>
    <br/>
    <div className="executive_pmap_title">Selected Semester (Config Name):</div><br/>
    <div className="executive_config_select">
      <SchoolConfigSelect/>
    </div>
 
    {/* //TODO Style HR tags */ }
    <hr/>

    <div className="executive_pmap_title">My Current Selection of Program Maps:</div><br/>

    <div className="executive_secondary_container">
    {activeProgramMapsList.length ? activeProgramMapsList : <div className="executive_white_text">Your current program map(s) selection is empty, add some below ...</div>}
    </div>

    <br/>
    {/* //TODO Style HR tags */ }
    <hr/>

    <div className="executive_pmap_title">Search & Add Program Maps to My Selection: </div><br/>

    <div className="executive_side_by_side">
    <button className="btn btn-primary" onClick={() => {setSOC(1)}} > Search by Keyword </button>
    <button className="btn btn-primary" onClick={() => {setSOC(0); searchProgramMaps(configName, 0);}} >View all Program Maps in Semester</button>

    </div>
{ //! Search Or Config Ternary
searchOrConfig ? 
    <div className="executive_search_bar_container">
 <div class="input-group mb-3">
  <input ref={searchRef} 
        type="text" 
        class="form-control" 
        placeholder="Search for program maps ... (example: software Y2 , mechatronics , engineering winter , nursing , commerce third year)" 
        aria-describedby="basic-addon2"
        onKeyDown={(e) => {searchPmKDwrap(e,searchRef.current.value, 0)}}      
  />
  
  <div class="input-group-append">
    <span class="input-group-text" id="basic-addon2">
    
    {/* Search button for the search Pmaps input ^ */}
    <button 
    className ="btn btn-warning"
    onClick={() => {searchProgramMaps(searchRef.current.value, 0);}}>
      Search Program Maps
    </button>

    </span>
  </div>
</div>
    </div> : <>{/*Render Empty element*/}</>
    }
    
   
    <div className="executive_side_by_side">

    <div>
    <span className="executive_pmap_title" id="results_for_term">Results for term: "{searchTerm}":</span>
    </div>

    <div className="executive_page_count">
    page: {pageCount}
    </div>

    </div><span id="error_message" class="error_message"></span>

    {/* Page number display */}

   <div class={resultState ? "executive_search_container" : "executive_search_container executive_crop"} 
        id="style-1"
        onKeyDown={(e) => {searchResultKDwrap(e)}}
        tabIndex="1"
    > 
      {programMapsList}
    </div>
    <div className="executive_side_by_side">
    <button className="btn btn-outline-dark" onClick={() => {dispatch(setPage({"action" : false}))}}>
      Back
    </button>

    <button className="btn btn-outline-dark" onClick={() => {dispatch(setPage({"action" : true}))}}>
      Next
    </button>
    </div>
    
</>
  );
}

export default ExecutiveProgramMaps