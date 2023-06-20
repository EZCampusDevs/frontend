import React from 'react';
import PageHeader from '../components/navbar/PageHeader';

const schools = [
  'otu',
  'uvic',
  'dc',
  'School 4',
  'School 5',
  'School 6',
  'School 7',
  'School 8',
  'School 9',
  'School 10',
];

const SchoolRoutePage = () => {
  const goToSchoolPage = (schoolName) => {
    window.location.href = `https://${schoolName}.ezcampus.org`;
  };

  return (
    <>
    <PageHeader />
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-800">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 max-w-screen-xl w-full">
        {schools.map((school, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center p-6 bg-blue-500 hover:bg-blue-600 transition duration-200 ease-in-out text-white rounded-lg shadow-md dark:text-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200"
            onClick={() => goToSchoolPage(school)}
          >
            {school}
          </button>
        ))}
      </div>
    </div>
    </>
  );
};

export default SchoolRoutePage;
