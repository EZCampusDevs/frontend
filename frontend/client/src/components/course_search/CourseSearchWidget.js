import React from 'react'

//Redux

import { useSelector, useDispatch } from 'react-redux';
import { loadIn } from '../../redux/features/courseSearchSlice';
import { debounce } from 'lodash';

//TODO: Get that callback add thing that propagates out of CourseSearchWidget component

const CourseSearchWidget = () => {

    //React State:
    const [results,setResults] = React.useState("Results are empty..."); //Search Results
    const searchTerm = React.useRef('');  

    //Redux State:
    const search_entries = useSelector((state) => state.courseSearch.ics_search_entries);
    const dispatch = useDispatch();

    // Search Reset (Reload new data) function
    const reduxLoadIn = (payload) => {

        dispatch(loadIn({
            payload, 
            reference : "ics" 
        }));
    }

    //POST Request
    const keystrokeSearchPOST = debounce(async () => {

          const RESPONSE = await fetch(SEARCH_ENDPOINT + 'search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "search_term": searchTerm.current.value , "page": 1, "results_per_page": 5, "term_id": 202305 })
          });
      
            let ResponseJSON = await RESPONSE.json();
            console.log(ResponseJSON);
            reduxLoadIn(ResponseJSON);

        
      }, 300); // Specify the debounce delay (in milliseconds)

    

    //TODO: Put this in API.js and get it working...
    //const SEARCH_ENDPOINT = `http://localhost:8080/searchIndex-1.0-SNAPSHOT/`;
    const SEARCH_ENDPOINT = `http://172.105.18.31:8080/searchIndex/`;


    //JSX builders

    //TODO: Improve the builder

    const searchEntryBuilder = (payload) => {

        if(payload.length === 0){
            return;
        }

        let dump = [];

        for(const entry of payload) {
            
            console.log(entry);

            dump.push(

        //TODO: Make the stylings here better
        
<div class="bg-white border border-black rounded-lg p-4 w-full mb-5">
    <p class="text-xl font-bold mb-2">{entry.course_code}</p>
    <p class="text-2xl font-semibold mb-2">{entry.course_title}</p>
    <p class="text-lg mb-2">{entry.course_crn}</p>
    <p class="text-lg mb-2">{entry.course_data_id}</p>
    <p class="text-lg mb-2">{entry.course_desc}</p>
    <p class="text-lg mb-2">N/A</p>

    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4" >Add Course</button>
</div>


            );
            
        }

        setResults(dump);

    }


  //Once the search Entries change, rebuild the Search Results List
  React.useEffect(
    () => {
        searchEntryBuilder(search_entries.payload);
    }, [search_entries]
    );

  return (
    <>

    <div class="relative">

        {/* actual input box for search */}

        <input type="text" onChange={keystrokeSearchPOST} ref={searchTerm} placeholder="Search Course Codes, CRNs, Prof names" class="medium_search_bar" />

        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

            {/* Magnifying Glass Icon for Search Bar */}
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>

        </div>
        
    </div>


    <div>     

    <div className="overflow-y-scroll scrollbar-thumb-blue-500 scrollbar-track-blue-200 height_cap" >
            {results} {/* <-- SEARCH RESULTS */}
    </div>


    </div>
    </>
  )
}

export default CourseSearchWidget