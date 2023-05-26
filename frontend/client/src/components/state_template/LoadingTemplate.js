import React from 'react'
import '../../static/css/main_ui.css';
import '../../static/css/loaders.css';

const LoadingTemplate = () => {
  return (
    <div className="main_body load_wrapper">
        <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>

    </div>
  )
}

export default LoadingTemplate