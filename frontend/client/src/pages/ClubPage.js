import React from 'react';
import { useParams } from 'react-router-dom' ;

import PageHeader from '../components/navbar/PageHeader';
import RenderWall from '../components/util/RenderWall';
import DeniedTemplate from '../components/state_template/DeniedTemplate';
import LoadingTemplate from '../components/state_template/LoadingTemplate';
import ClubSubscription from '../components/club/ClubSubscription';

//Local file imports
import ENDPOINT from '../util/API';
import findCookie from '../util/findCookie';
import '../static/css/club.css';

const ClubPage = () => {

//State
  const [auth,setAuth] = React.useState(-1);
  const [meetDump, setMeetDump] = React.useState({});

  let { uuid } = useParams(); 

  const initializeClub = async () => {
    document.title = "loading club . . ."
    //Check if the access_token cookie exists first:

    const token = findCookie('access_token', document.cookie);

      const paramURL = token ? 'calendar/view/authed' : 'calendar/view/guest'
      console.log('Requesting: '+paramURL)
 // Exists, let's try to auth
        const RESPONSE = await fetch(ENDPOINT + paramURL, {
          method: 'POST' , 
          headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token }, 
          body: JSON.stringify(  
            [uuid]
          )
        }
        
        );

        if(RESPONSE.status === 200){ // IF STATUS IS OK & Data comes back
          let respJSON = await RESPONSE.json();
          respJSON = respJSON.detail;
    
          setAuth(token ? 1 : 0) // OK state (authed)
          setMeetDump(respJSON[0]);
    
        } else if(RESPONSE.status === 404){ //NO ROOM FOUND
          setAuth(2); // Not Found Auth state
        } 
  }

  const pageRender = (subButton) => {
    document.title = meetDump['title'];
    return <>
    <PageHeader/>
    <div className="club_page_body">
    <div className="cc_title_break">
                <h1>{meetDump['title']} {meetDump['is_public'] ? '' : ' (private) '}</h1>
                <h6>{meetDump['description'] || 'No description to display...'}</h6>
  
                {subButton}
            </div>
  
  
  
  
    </div>
    </>
  }


  const denied_tmpl = pageRender('');

  const loading_tmpl = <>
  <PageHeader/>
  <LoadingTemplate/>
  </>

  const authed_tmpl = pageRender(
    <ClubSubscription uuid={uuid} meetDump={meetDump} setMeetDump={setMeetDump}/>
  )

  const not_found_tmpl = <>
  <PageHeader/>
  <div>
      Club not found...
  </div>
  </>

  React.useEffect(() => {

  initializeClub();

  }  , []);

  return (
    <div>
        <RenderWall 
          auth={auth} 
          deniedTemplate={denied_tmpl} 
          loadingTemplate={loading_tmpl} 
          authedTemplate={authed_tmpl}
          notFoundTemplate={not_found_tmpl}
        />
    </div>
  )
}

export default ClubPage