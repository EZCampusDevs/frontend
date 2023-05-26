import React from 'react'

const OptimizeButton = ({requestCallback, config, ccEntries}) => {

 //* Prop breakdown: (Call by OptimizerPage component)
// `requestCallback` : refers to the callback that needs to be called for the API POST request to be made in page
// `config`          : refers to passed in configName (current config state of the page)
// `ccEntries`       : refers to the amount of saved course code entries the user's put in


  //Enabled Button State before being clicked:

  const [loader, setLoader] = React.useState(
    <></>
  );

  //Button when loading results:

  const loaderJSX = <>
  <div style={{'textAlign':'center'}} className="b_loader">        
  </div>
  </>;


  //! If contraint condition(s) are true, BUTTON ENABLED:
  if(config && ccEntries.length) {

  return (<>
      <button className='btn btn-success optimizer-demo-btns' 
      onClick={() => {requestCallback(); setLoader(loaderJSX)}}>         
      Optimize 
      </button>

      {loader}
  </>);

  } else {   //* BUTTON DISABLED:
  return (<>
      <button className='btn-danger btn disabled optimizer-demo-btns'> There isn't enough information to optimize yet </button>
    </>);

  }
}

export default OptimizeButton