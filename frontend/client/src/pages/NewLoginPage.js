import React from 'react'
import PageHeader from '../components/navbar/PageHeader'
import Cookies from 'universal-cookie';

//Local stuff
import { cookieAuthCheck } from '../util/browserUtil';


const NewLoginPage = () => {

    const cookies = new Cookies();

    //State:
    const [errorMsg, setErrorMsg] = React.useState('');
    const [auth, setAuth] = React.useState(-1);
  
    //Ref strings:
    const usernameStr = React.useRef('');
    const passwordStr = React.useRef('');  
    
//Views:
  
const loading_tmpl = <div>Loading...</div>

//TODO: 
const authed_tmpl = <div>Leave pls.. ur already logged in...</div>

//This is a function since it needs a param passed in
const denied_tmpl = (
    <>
    <PageHeader/>
    <section className="py-5">
        <div className="container">
            <div className="row mb-4 mb-lg-5">
                <div className="col-md-8 col-xl-6 text-center mx-auto">
                    <h2 className="main_title">Welcome to EZCampus</h2>
                </div>
            </div>
            <div className="row d-flex justify-content-center" >
                <div className="col-md-6 col-xl-4">
                    <div className="card">
                        <div className="card-body text-center d-flex flex-column align-items-center">
                            <div className="bs-icon-xl bs-icon-circle bs-icon-primary shadow bs-icon my-4"><svg width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-person">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
                                </svg></div>
                            <form method="post">
                                <div className="mb-3"><input className="form-control" type="email" name="email" placeholder="Email"/></div>
                                <div className="mb-3"><input className="form-control" type="password" name="password" placeholder="Password"/></div><a className="navbar-brand d-flex align-items-center" href="/"></a>
                                <div className="mb-3"><button className="btn btn-primary shadow d-block w-100" type="submit" style={{marginTop: '12px'}}>Log in</button></div>
                                <p className="text-muted">Forgot your password?</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    </>
    );
      

  //!View switching function:

  const renderLoginPage = (authState) => {

    if(authState === -1){return loading_tmpl;} //If -1, Loading Page
    else if (authState === 1){return authed_tmpl;} //If 1, Authed User, just redir
    else {return denied_tmpl;} //If 0 or anything else, Denied

    }

    React.useEffect( //Upon mount, set the Auth state given the cookies (used above) to render appropriate view  
        () => {
        setAuth(cookieAuthCheck(document.cookie, true));
        } , []
    )

  return (<div> {renderLoginPage(auth)} </div>);
}

export default NewLoginPage