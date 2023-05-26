import React from 'react'


const RenderWall = ({auth , deniedTemplate , loadingTemplate, authedTemplate, notFoundTemplate}) => {
  
    const renderPage = (authState) => {

        if(authState === -1){return loadingTemplate;} //If -1, Loading Page
        else if (authState === 1){return authedTemplate;} //If 1, Authed User
        else if (authState === 2){return notFoundTemplate;} //If 2, Not found tmpl
        else {return deniedTemplate;} //If 0 or anything else, Denied
    
    }  

  return (
    <>
    {renderPage(auth)}
    </>
  )
}

export default RenderWall