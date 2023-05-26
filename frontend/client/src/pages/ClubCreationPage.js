import React, { useEffect } from 'react'

//Local imports:
import findCookie from '../util/findCookie';
import ENDPOINT from '../util/API';
import '../static/css/club.css';
import { app_name } from '../util/constant';
import { InitRequest } from '../util/requests';

//Component imports:

import RenderWall from '../components/util/RenderWall';
import PageHeader from '../components/navbar/PageHeader';
import ClubEditMeeting from '../components/club/ClubEditMeeting';
import LengthCount from '../components/util/LengthCount';
import DeniedTemplate from '../components/state_template/DeniedTemplate';
import LoadingTemplate from '../components/state_template/LoadingTemplate';

//Redux state
import { useSelector, useDispatch } from 'react-redux'

const ClubCreationPage = () => {

  //Tab title:
  document.title = app_name + " | Club Creation"
  
  const meetStore = useSelector((state) => state.meetingEdit.meeting_entries)

  //Authentication State:

  const [auth, setAuth] = React.useState(-1);


  // Popup state:
  const [popBool, setPop] = React.useState(false);

  //Description length state (for display purposes)

  const [submitState, setSS] = React.useState(0);
  const [creaUUID, setUUID] = React.useState('');

  const[clubPublic, setCPB] = React.useState(false);

  const [clubDescLen, setCDL] = React.useState(0);
  const [clubNameLen, setCNL] = React.useState(0);

  // User input references:

  const clubName =        React.useRef('');
  const clubCategory =    React.useRef('');
  const clubDescription = React.useRef('');
  const clubCapacity =    React.useRef(0);
  const clubPublicBool =  React.useRef(false);


  //Templates:

  const loading_tmpl = <>
      <PageHeader/>
      <LoadingTemplate/>
  </>

  //Generate Categories:

  const genCategories = () => {

    let gen = [];

    const categories = [
      'Society',
      'Sports',
      'Official OTU Event',
      'Student Organized Event',
      'Study Group',
    ];

    for(const category of categories){
      gen.push(
        <option value={category}>{category} </option> 
      )
    }

    return gen;
  }

  const trackLength = (event, setState) => {
    setState((event.target.value).length);
  }


  const checkboxMsg = (bool) => {
    return (
      (bool !== true) ? 
      <div className="club_small_secondary">
        This club will be publicly available.
      </div> :
      <div className="club_small_secondary">
        This club will be private.   
      </div>
    )

  }

  //Submission state
  const submitRender = (subState) => {
    switch(subState) {
      case 0: // Initial state 
          return( <>

            <button className="btn btn-primary" onClick={(e) => {submitRequest()}}> Create Club</button>

          </>)
      case -1: // Loading State
          return <>
            Processing request...
          </>
      default:
        // code block
    }


  }


  const authed_tmpl = <>
    <div className="club_page_body">
      <PageHeader/>
          <div className="cc_title_break">
              <h1>Create A Club!</h1>
              <h6>Whether it's for an official society or just a group for friends !</h6>
          </div>



      <div className="cc_cont">
        <div className="side_by_side_wrapper">
        <div className="club_section_title">
          Enter a name for your club: 
        </div>


        <LengthCount state={clubNameLen} threshold={99}/>

        </div>

        <input type="text" 
        className="form-control" 
        ref={clubName}
        onChange={(e) => {trackLength(e , setCNL)}}
        Placeholder="E. G : OTU Ridgebacks Men's Basketball Team ,  OTU Underwater Robotics Club ,  Jason's Hackathon team for OTU Hack 2022 . "/>
      </div>

      <div className="cc_cont">

        <div className="triple_wrapper">

          <div>
              <div className="club_section_title">
              Pick a suitable category for your club:
              </div>

              <select 
              className="form-select f-s-edit"
              defaultValue="01:00:00"
              ref={clubCategory}
              onChange={(e) => {}}>
                {genCategories()}
              </select>

          </div>

          <div>
            <div className="club_section_title">
              Your club's privacy status:
            </div>

            <div className="checkbox_wrapper">

                <input 
                  type="checkbox" 
                  ref={clubPublicBool} 
                  className="form-check-input"
                  onChange={() => {setCPB(clubPublicBool.current.checked)}}/> 
                {checkboxMsg(clubPublic)}
            </div>
          </div>

          <div>
              <div className="club_section_title">
              Your club's subscriber capacity:
              </div>

              <input  type="number" className="form-control" defaultValue={120} ref={clubCapacity}/>

          </div>

        </div>

      </div>

      <div className="cc_cont">

      <div className="side_by_side_wrapper">
      <div className="club_section_title">
          Add a description to your club: 
        </div>
        <LengthCount state={clubDescLen} threshold={499}/>

        
      </div>


      <textarea 
        className="form-control" 
        rows="3"
        Placeholder="Briefly describe your club ,  include any important information for club subscribers ,  etc..."
        ref={clubDescription}
        onChange={(e) => {trackLength(e , setCDL)}}  
      />

      </div>

      {/* Setting up meetings */}
      <div className="cc_cont">
        <button className="btn btn-secondary" onClick={() => {setPop(true)}}>Manage club events</button>

      </div>


      <div className="cc_cont">
      
      {/* Small state switcher for submission: */}
       {submitRender(submitState)}


      </div>


    </div>

  </>

  const created_tmpl = <>
    <PageHeader/>
    <div className="club_page_body">
      <br/><br/><br/>
    <div className="cc_cont">
      <div className="club_section_title">
        Successfully your created club!<br/><br/>
        Club Name :  <span className="club_section_title_secondary">{clubName.current.value}</span> <br/>
        Club Unique Identifier: <span className="club_section_title_secondary">{creaUUID}</span> <br/>
        Club Link: <a href={creaUUID} className="club_section_title_link">View Club Page</a>
        </div>
    </div>

    </div>
  </>

  const denied_tmpl = <>
  <PageHeader/>
    <DeniedTemplate/>
  </>

  // This needs to be wrapped due to the async
  const Initialize = async () => {

    setAuth(-1);
    setAuth(await InitRequest());

  }
  
  // Submission request

  const submitRequest = async () => {
    
    setSS(-1);
  

    const token = findCookie('access_token', document.cookie);

    const response = await fetch(ENDPOINT + 'calendar/create', {
      method: 'POST' , 
      headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token } , 

      body: JSON.stringify({
        "cal_new": {
          "name": clubName.current.value,
          "category": clubCategory.current.value,
          "description": clubDescription.current.value,
          "is_public": !(clubPublicBool.current.checked),
          "subscribe_capacity": clubCapacity.current.value
        },
        "extended_meeting_list": meetStore
      })

      }
    );


    //! THIS IS FORSURE BROKEN RIGHT NOW, FIX IT ASAP

    let result = await response.json();
    result = result.detail
    
    if(response.status === 200){
      setUUID(result);
      setAuth(2);
    }

  }


  useEffect(() => {
    Initialize();
  }, []);

  return (
    <div>
      <ClubEditMeeting trigger={popBool} setTrigger={setPop} body={null}/>
      <RenderWall auth={auth} deniedTemplate={denied_tmpl} loadingTemplate={loading_tmpl} authedTemplate={authed_tmpl} notFoundTemplate={created_tmpl}/>
    </div>
  )
}

export default ClubCreationPage