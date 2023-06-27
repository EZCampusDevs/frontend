import React from 'react'
import PageHeader from '../components/navbar/PageHeader'
import '../static/css/main_ui.css'

import otuLogo from '../static/images/otuLogo.png'
import uvicLogo from '../static/images/uvicLogo.png'
import dcLogo from '../static/images/dcLogo.png'

//Try to re-use styles from index.css ! (Going for UI Uniformity where all components look the same across all pages)
const allSchools = [
  {name: 'Ontario Tech U', redirect: 'otu', logo: otuLogo,},
  {name: 'University of Victoria', redirect: 'uvic', logo: uvicLogo,},
  {name: 'Durham College', redirect: 'dc',  logo: dcLogo,},
];

const SchoolRoutePage = () => {

  const redirectSchool = (school) => {
    window.location.href = `https://${school.redirect}.ezcampus.org`;
  };
    
  return (
    <div>
    <PageHeader/>
      <header style={{textAlign: 'center', width:'100%', height: 'auto', backgroundSize: 'cover', backgroundAttachment:'fixed',
                      position:'relative', overflow:'hidden', borderRadius: '0 0 85% 85% / 20%'}}>
      <div className="overlay flex flex-col body-font items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed"
      style={{width: '100%',
        height: '100%',
        padding: '50px',
        color:'#fff',
        textShadow: '1px 1px 2px #333',
        backgroundImage: 'linear-gradient(135deg, #94a3b8 10%, #a5f3fc 90%)',}}>
        {/* <h1 className='font-sans font-bold text-6xl mb-4 text-white dark:text-sky-500'>Select Your School</h1> */}
          <div className='box text-black' style={{fontSize: '3vw', margin: 'max(0.3rem, 1vmin)', border: '0.35rem solid', padding: '0.5vw',
                                        borderImage: 'conic-gradient(from var(--angle), var(--c2), var(--c1) 0.1turn, var(--c1) 0.15turn, var(--c2) 0.25turn) 30',
                                        animation: 'borderRotate var(--d) linear infinite forwards',}}>
            <h1>Select Your School</h1>

          </div>
      </div>
      </header>
      <div className="flex flex-col items-center justify-top min-h-screen bg-black-100 dark:bg-gray-800 -mt-6">
        <div className='max-w-screen-xl' style={{marginTop: '1rem'}}>

          <div className="grid grid-cols-1 items-center sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 x1:grid-cols-5 gap-4 p-4 mt-4">
            {allSchools.map((school, index) => (

              <div key={index} className="btn-glow"
                style={{display: 'flex', flexDirection: 'column',alignItems:'center'}} 
                onClick={() => {redirectSchool(school);}}
              >
                <button
                  className={"relative overflow-hidden flex flex-col items-center justify-center rounded-lg border-none p-0 shadow-md transition-all duration-300 transform hover:scale-105"}
                  style={{width: '180px', height: '110px',
                          backgroundColor: 'white',}}
                >
                  <img className='max-w-full max-h-full' 
                  src={school.logo} 
                  alt='buttonpng'/>                        
                </button>
                <span className='r_font font-semibold mt-1'>{school.name}</span>
              </div>
                
            ))}
            

          </div>
        </div>
      </div>
        <style>
          {`
       
            .btn-glow {
              position: relative;
              z-index: 0;
              border-radius: 10px;
            }

            .btn-glow:before {
              content: '';
              background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
              position: absolute;
              top: -2px;
              left:-6px;
              background-size: 400%;
              z-index: -1;
              filter: blur(5px);
              width: calc(100% + 15px);
              height: calc(100% + 10px);
              animation: glowing 10s linear infinite;
              opacity: 0;
              transition: opacity 0.3s ease-in-out;
              border-radius: 10px;
            }
            .btn-glow:hover:before {
              opacity: 1;
            }
            .btn-glow:after {
              z-index: -1;
              content: '';
              position: absolute;
              width: 100%;
              height: 100%;
              background: white;
              left: 0;
              top: 0;
              border-radius: 10px;
            }
            @keyframes glowing {
              0% { background-position: 0 0; }
              50% { background-position: 400% 0; }
              100% { background-position: 0 0; }
            }
            @keyframes borderRotate {
              100% { --angle: 420deg;}
            }
            @property --angle{
              syntax: '<angle>';
              initial-value: 90deg;
              inherits: true;
            }
            :root {
              --d: 2500ms;
              --angle: 90deg;
              --c1: rgba(11, 243, 27, 1);
              --c2: rgba(11, 243, 27, 0.2);
          `} 
        </style>
    </div>
  );
};

export default SchoolRoutePage;
