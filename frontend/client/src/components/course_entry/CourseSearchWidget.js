import React from 'react'

//util
import { logVoid } from '../../util/logger';

//Components:
import ScrollableDiv from './ScrollableDiv';

//Redux

import { useSelector, useDispatch } from 'react-redux';
import { loadIn, addPage } from '../../redux/features/courseSearchSlice';
import { SchoolTermRequest, SearchCoursesByTerm } from '../../util/requests';

import { iconBuilder } from '../../util/reactHelper';
import '../../static/css/main_ui.css';
import CourseSearchResultEntry from './CourseSearchResultEntry';


//TODO: Get that callback add thing that propagates out of CourseSearchWidget component

const CourseSearchWidget = ({AddCourseCallback}) => {



    // Instead of using the entire Lodash Library for one function...
    //https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_debounce
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            if (immediate && !timeout) func.apply(context, args);
            timeout = setTimeout(function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
        };
      }
      

    //React State:
    const [results,setResults] = React.useState("Results are empty..."); //Search Results
    const searchTerm = React.useRef('');  

    const [lastPageSize, setLPS] = React.useState(2);
    const [page, setPage] = React.useState(2);

    //Redux State:
    const search_entries = useSelector((state) => state.courseSearch.ics_search_entries);
    const saved_entries = useSelector((state) => state.courseEntry.ics_dl_entries);
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
        logVoid("keystrokeSearchPOST::Posted Search Term");
        setPage(2);
        SearchCoursesByTerm(searchTerm.current.value, 1, search_entries.results_per_page, parseInt(term_id), reduxLoadIn); //API POST
    }, 300); 
    // Specify the debounce delay (in milliseconds)

    //JSX builders

    //TODO: Improve the builder

    const searchEntryBuilder = (payload) => {

        if(payload.length === 0){
            setResults(
            <h3 className="sub_title">
                {iconBuilder( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
            ,"No courses found...")}
            </h3>
            )
            return; //Set the Searches results to not found
        }

        let dump = [];
        // Create an empty array to store the sorted entries
        const sortedEntries = [];

        // for (const entry of saved_entries) {
        //     course_data_ids_list.push(entry.course_data_id);
        //   }

        for (let entry of payload) {

            const EntryCDI = entry.course_data_id;

            //* Removal of Entry in Search, once it's added as Saved Entry
            //! ##### BANDAID FIX FOR WEIRD DUPLICATE RENDERING ERROR #######
            // let isDuplicate = false;

            // if(saved_entries.length) {
            //     for (const saved_entry of saved_entries) {
            //         if(saved_entry.course_data_id === EntryCDI) {
            //             isDuplicate = true;
            //             console.log("Avoided...");
            //             break;
            //         }
            //     }
            //     if (!isDuplicate) {
            //         sortedEntries.push(entry);
            //     }
            // } else {
            //     sortedEntries.push(entry);
            // }
            //! ##### BANDAID FIX FOR WEIRD DUPLICATE RENDERING ERROR #######

            
            let moddedEntry = {...entry, is_saved : false}

            if(saved_entries.length) {
                for(const saved_entry of saved_entries) {
                    if(saved_entry.course_data_id === EntryCDI) {
                        moddedEntry.is_saved = true;
                        break;
                    }  
                }
            }

            sortedEntries.push(moddedEntry); 
        }

        // Sort the entries based on the ranking in ascending order
        sortedEntries.sort((a, b) => b.ranking - a.ranking);

        for (let index = 0; index < sortedEntries.length; index++) {
            const E = sortedEntries[index];
            dump.push(
              <CourseSearchResultEntry key={index} entry={E} AddCourseCallback={AddCourseCallback}/>
            );
        }
          

        setResults(dump);

    } //endof search builder 


  //Once the search Entries change, rebuild the Search Results List
  React.useEffect(
    () => {
        searchEntryBuilder(search_entries.payload);
    }, [search_entries, saved_entries]
    );
    //Remove dependency on saved_entries if you'd like to remove duplicate checking feature on search

  return (
    <>
<div className="relative flex items-center">

{/* Magnifying Glass Icon for Search Bar */}
<div className="absolute pl-3">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
</div>

{/* actual input box for search */}
<input type="text" onChange={keystrokeSearchPOST} ref={searchTerm} placeholder="Search Course Codes, CRNs, Prof names" 
className="medium_search_bar r_font flex-grow" />

    {/* Button | Comment it out and the Search Bar will dynamically adjust
    <button onClick={keystrokeSearchPOST} className="w-36 bg-slate-700 text-white p-2 rounded-lg ml-2">
        Search
    </button> */}
</div>



    <div>     

    <ScrollableDiv results={results} resultsPerPage={search_entries.results_per_page} callback={() => {handleScrollDown()}} />

    </div>
    </>
  )
}

export default CourseSearchWidget