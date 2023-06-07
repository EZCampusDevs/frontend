import React from 'react'

//Redux

import { useSelector, useDispatch } from 'react-redux';
import { loadIn } from '../../redux/features/courseSearchSlice';
import { debounce } from 'lodash';
import { SchoolTermRequest, SearchCoursesByTerm } from '../../util/requests';

//TODO: Get that callback add thing that propagates out of CourseSearchWidget component

const CourseSearchWidget = ({AddCourseCallback}) => {

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
        SearchCoursesByTerm(searchTerm.current.value, 0, reduxLoadIn); //API POST
    }, 300); 
    // Specify the debounce delay (in milliseconds)

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


    <button className="ml-6 w-72 flex items-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
    onClick={() => {AddCourseCallback(entry)}} 
    >
      <svg clip-rule="evenodd" fill="#FFFFFF" className="w-6" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12.002 2c5.518 0 9.998 4.48 9.998 9.998 0 5.517-4.48 9.997-9.998 9.997-5.517 0-9.997-4.48-9.997-9.997 0-5.518 4.48-9.998 9.997-9.998zm-.747 9.25h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z" fill-rule="nonzero"/></svg>
      <span className="ml-3">Add Course</span>
    </button>
</div>


            );
            
        }

        setResults(dump);

    } //endof search builder 


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