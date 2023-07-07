import React from 'react';
import { loadSchool } from '../../util/browserUtil';

import SchoolRoutePage from '../../pages/SchoolRoutePage';
//Purpose of this Component is to Restrict Access to a page unless we know which school they're from


const SchoolRouteRenderWall = ({page}) => {

  const [routed, setRoutedStatus] = React.useState(false);  

  React.useEffect(() => {

    const lS = loadSchool();

    console.log(lS);
    setRoutedStatus(lS);
  }, [])  

  return (
    routed ? page : <SchoolRoutePage/>
  );
}

export default SchoolRouteRenderWall