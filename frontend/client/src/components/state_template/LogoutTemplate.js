import React from 'react'

//Style sheets
import '../../static/css/main_ui.css'

//Local functions
import { logout } from '../../util/browserUtil'

const LogoutTemplate = () => {


  return (
    <div className="main_body">
    <div className="login_panel box_shadow">     
    <h2 className="panel_title">It seems like you're already logged in!</h2>
    <button onClick={() => {logout()}} className="login_btn btn-primary btn">Logout</button>
    </div>
  </div>

  )
}

export default LogoutTemplate