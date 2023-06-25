import React from 'react'
import PageHeader from '../components/navbar/PageHeader'
import '../static/css/main_ui.css'


//Try to re-use styles from index.css ! (Going for UI Uniformity where all components look the same across all pages)
const allSchools = [
  {name: 'Ontario Tech U', color: '#0077CA', hover: '#E75D2A', redirect: 'otu'},
  {name: 'University of Victoria', color: '#C63527', hover: '	#F5AA1C', redirect: 'uvic'},
  {name: 'Durham College', color: '#0B8261', hover: '#3E2B2F', redirect: 'dc'},
];

const SchoolRoutePage = () => {

  const redirectSchool = (school) => {
    window.location.href = `https://${school.redirect}.ezcampus.org`;
  };
    
  return (
    <div>
    <PageHeader/>

      <div className="section flex flex-col body-font items-center justify-center p-10 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{backgroundImage: "url(https://ychef.files.bbci.co.uk/976x549/p037y4zx.jpg)",
      position: 'relative',}}>z
        <h1 className='font-sans font-bold text-6xl mb-4 text-white dark:text-sky-400'>Select Your School</h1>
      </div>
      <div className="flex flex-col items-center justify-top min-h-screen bg-teal-100 dark:bg-gray-800">

          
        <div className='max-w-screen-x1'>

          <div className="grid grid-cols-1 items-center sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 x1:grid-cols-5 gap-4 p-4">
            {allSchools.map((school, index) => (
              <button key={index} 
              className={"flex flex-col items-center justify-center p-6 rounded-lg r_font font-semibold shadow-md transition-all duration-300 transform hover:scale-105"}
              style={{backgroundColor: school.color, width: '180px', height: '110px'}}
              onMouseEnter={(e) => {e.target.style.backgroundColor = school.hover;}}
              onMouseLeave={(e) => {e.target.style.backgroundColor = school.color;}}
              onClick={() => {redirectSchool(school);}}>{school.name}
              </button>
            ))}

          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SchoolRoutePage;
