import React from 'react'

//Components:
import ScrollableDiv from './ScrollableDiv';

//Redux

import { useSelector, useDispatch } from 'react-redux';
import { loadIn, addPage } from '../../redux/features/courseSearchSlice';
import { debounce } from 'lodash';
import { SchoolTermRequest, SearchCoursesByTerm } from '../../util/requests';

import '../../static/css/main_ui.css';
import CourseSearchResultEntry from './CourseSearchResultEntry';


//TODO: Get that callback add thing that propagates out of CourseSearchWidget component

const CourseSearchWidget = ({AddCourseCallback}) => {

    //React State:
    const [results,setResults] = React.useState("Results are empty..."); //Search Results
    const searchTerm = React.useRef('');  

    const [lastPageSize, setLPS] = React.useState(2);
    const [page, setPage] = React.useState(2);

    //Redux State:
    const search_entries = useSelector((state) => state.courseSearch.ics_search_entries);
    const term_id = useSelector((state) => state.configSelect.selected_term);
    const dispatch = useDispatch();

    // Search Reset (Reload new data) function
    const reduxLoadIn = (payload) => { //& RESETS WITH NEW `payload`

        dispatch(loadIn({
            payload, 
            reference : "ics" 
        }));
    }

    const reduxAdd = (payload) => { //& Adds on top of `payload` already appended
        dispatch(addPage({
            payload, 
            reference : "ics" 
        }));
        setPage(page+1);
    }

    const handleScrollDown = () => {
        SearchCoursesByTerm(searchTerm.current.value, page, search_entries.results_per_page, parseInt(term_id), reduxAdd); //API POST
    }

    //POST Request
    const keystrokeSearchPOST = debounce(async () => {
                        //* Search Term, Term Id (int), Redux Callback
                        setPage(2);
        SearchCoursesByTerm(searchTerm.current.value, 1, search_entries.results_per_page, parseInt(term_id), reduxLoadIn); //API POST
    }, 300); 
    // Specify the debounce delay (in milliseconds)

    //JSX builders

    //TODO: Improve the builder

    const searchEntryBuilder = (payload) => {

        if(payload.length === 0){
            setResults(<p>No results found...</p>)
            return;
        }

        let dump = [];
        // Create an empty array to store the sorted entries
        const sortedEntries = [];

        for (const entry of payload) {
            sortedEntries.push(entry);
          }
          
          // Sort the entries based on the ranking in ascending order
          sortedEntries.sort((a, b) => b.ranking - a.ranking);

        for(const entry of sortedEntries) {
            dump.push(
                <CourseSearchResultEntry entry={entry} AddCourseCallback={AddCourseCallback}/>
            );}

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

        <input type="text" onChange={keystrokeSearchPOST} ref={searchTerm} placeholder="Search Course Codes, CRNs, Prof names" class="medium_search_bar r_font" />

        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

            {/* Magnifying Glass Icon for Search Bar */}
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon_styling">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>

        </div>
        
    </div>


    <div>     

    <ScrollableDiv results={results} callback={() => {handleScrollDown()}} />

    </div>
    </>
  )
}

export default CourseSearchWidget