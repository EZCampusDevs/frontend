import React from 'react'

const SearchAddCourseEntry = ({callback, reference, index, configName}) => {
  
  
    const [vis, setVis] = React.useState(true);
  
    return (
        (vis) ? (
        <>
    <div class="relative">

    {/* actual input box for search */}

    <input type="text" placeholder="Search Course Codes, CRNs, Prof names" class="medium_search_bar" />
    
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

        {/* Magnifying Glass Icon for Search Bar */}
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>

    </div>
    </div>

    <br/> 

    <div>
            Results
    </div>
        
        </>
        ) : ""
  )
}

export default SearchAddCourseEntry