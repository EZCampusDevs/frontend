import React from 'react'
import { useEffect } from 'react'

//Local imports
import ENDPOINT from '../util/API'
import findCookie from '../util/findCookie';
import '../static/css/search_pg.css';

import { logVoid } from '../util/logger';
import useWindowDimensions from '../util/hooks/useWindowDimensions';
import useScript from '../util/hooks/useScript';


//Components 
import PageHeader from '../components/navbar/PageHeader'
import ClubElement from '../components/club/ClubElement';

//Redux
import { useSelector, useDispatch } from 'react-redux'
import { contentRefresh, lengthRefresh, pageIncrease, pageDecrease} from '../redux/features/searchSlice'


const ClubSearchPage = () => {
    
    const content = useSelector((state) => state.searchStorage.content);
    const reduxPage = useSelector((state) => state.searchStorage.page);
    const reduxTermLength = useSelector((state) => state.searchStorage.length);
    const dispatch = useDispatch();  

    useScript("https://kit.fontawesome.com/a076d05399.js");

    //Authentication State:

    const [auth, setAuth] = React.useState(-1);


    
    //Other state

      //Dimensions hook
     const { height, width } = useWindowDimensions();

    const searchRef = React.useRef();

    //Constants:

    const DEFAULT_SEARCH = "jasonmzx";

    //Scalability
    const scaleHandle = (width ) =>{


        if(width > 620){
            logVoid("Scaling past 620..")
            return entryColumns(content, 3)
        } else {
            logVoid("NOT Scaling past 620..")
            return entryColumns(content, 1)
        }
    }


    //API Request

    const Search = async (searchStr, pageInt) => {
        const token = findCookie('access_token', document.cookie);

        const paramURL = token ? 'calendar/search/authed' : 'calendar/search/guest';

        let reqBody = {
            "search_string": searchStr,
            "search_result_limit": 6,
            "page" : pageInt
          }
        
        console.log(reqBody);

        const RESPONSE = await fetch(ENDPOINT + paramURL, {
            method: 'POST' , 
            headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token },
            body: JSON.stringify(reqBody)
            }
        );

          //If ok
        if(RESPONSE.status === 200){
            let new_content = await RESPONSE.json();
            new_content = new_content.detail;

            dispatch(contentRefresh({ new_content : new_content["data"]  })); //Redux hook to new_content
            dispatch(lengthRefresh({length : new_content["length"] }));


            //buildEntries(JSON);
            return;
        }

        //If user isn't authed
        if(RESPONSE.status === 406){
            return null;
        }
        
    }


    const searchHandler = (searchStr) => {
        logVoid("Search Handler is called");

        if(searchStr.trim() === ""){
            console.log('Searching with param: p:'+reduxPage)
            Search(DEFAULT_SEARCH, reduxPage);
            return
        }
        Search(searchStr, reduxPage);
        
    }

    const entryColumns = (content, inputAmount) => {

        let entries = [];

        for(const entry of content){
            entries.push(
                <ClubElement entry={entry} key={entry.uuid}/>
            )
        }

        let columns = [];

        const ColumnConst = inputAmount;

        //Reduce entries to just 1 page:

       // entries = entries.slice( (page)*elementsPerPage , (page+1)*elementsPerPage );

        //Determine amount of columns to create 
        //Currently set to 3

        let ColumnAmount = Math.floor(entries.length / ColumnConst);

        let leftover = Math.abs(
            entries.length - (ColumnConst * ColumnAmount) 
        )

        for(let i = 0; i <= ColumnConst-1; i++){
            
            //Get the main slice
            let chunk = entries.slice(ColumnAmount*i , ColumnAmount*(i+1));

            if(leftover > 0){

                chunk.push(
                    entries[entries.length - leftover]
                )
                leftover--
            }

            columns.push(
                <div>
                {chunk}
                </div>
            );
        }


        return <div className="club_entry_grid">
            {columns}
        </div>

    }


  useEffect(
        () => {
            Search(DEFAULT_SEARCH, reduxPage);
            scaleHandle(width);
        } , []
  ); 

  useEffect(
    () => {
        searchHandler(searchRef.current.value);
    }, [reduxPage]
  );


 return (
    <div className="search_header_block">
    <PageHeader/>

    <div className="cc_title_break">
    <h1>Events</h1>
    <h5 className="club_small_secondary">.ics files are universally used by Google, Bing, Apple Calendar, Ubuntu, etc..!</h5>
        </div>

    <div className="input-group search">
            <input type="search" className="form-control" placeholder="Search" ref={searchRef}/>

        <button type="button" class="btn btn-primary" onClick={() => {
            searchHandler(searchRef.current.value, null);
        }}>
            <i class="fas fa-search"></i>
        </button>
    </div>
    
    <p style={{"color" : "black"}}>Page ({reduxPage+1} / {Math.ceil(reduxTermLength / 6)})</p>
{/* 
    {entryColumns(content, 3)} */}

        {scaleHandle(width)}

    <button onClick={() => { dispatch(pageDecrease()); }} >
        Back 
    </button>

    <button onClick={() => { dispatch(pageIncrease()); }} >
        Next 
    </button>
    </div>
  )


}

export default ClubSearchPage