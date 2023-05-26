import React from 'react'
import '../../static/css/main_ui.css';

const DeniedTemplate = () => {
  return (
    <div className="main_body">
          <div className="login_panel box_shadow"> 
          <h2 className="panel_title">Access Denied</h2>
          <p className="login_panel_text">You must Log In before accessing this page.</p>
            <br/><br/>
            <button className="login_btn btn btn-primary" onClick={ () =>
                { window.location.href = "/login" }
            }>Redirect me to Login Page</button>  
            <br/><br/>
            <button className="login_btn btn btn-secondary" onClick={ () =>
                { window.location.href = "/" }
            }>Redirect me to Home Page</button> 

            
          </div>

    </div>
  )
}

export default DeniedTemplate