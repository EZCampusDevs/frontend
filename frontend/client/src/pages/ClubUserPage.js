import React, { useEffect } from 'react'

//Component imports
import PageHeader from '../components/navbar/PageHeader'
import DeniedTemplate from '../components/state_template/DeniedTemplate';

const ClubUserPage = () => {
    
  //Authentication State:

  const [auth, setAuth] = React.useState(-1);

  const loading_tmpl = <>
    <div>Loading...</div>
  </>

  const authed_tmpl = <>


  </>

  const denied_tmpl = <></>



  const renderCalendarPage = (authState) => {

    if(authState === -1){return loading_tmpl;} //If -1, Loading Page
    else if (authState === 1){return authed_tmpl;} //If 1, Authed User
    else {return denied_tmpl;} //If 0 or anything else, Denied

}
    



  return (
    <>
      <PageHeader/>
      <a href="club/create">
        Create club
      </a>
    </>
  )
}

export default ClubUserPage