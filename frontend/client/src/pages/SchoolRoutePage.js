import React from 'react'
import PageHeader from '../components/navbar/PageHeader'


//Try to re-use styles from index.css ! (Going for UI Uniformity where all components look the same across all pages)

const SchoolRoutePage = () => {


    const genBtn = () => {
        return <button onClick={() => {window.location.href = "https://otu.ezcampus.org"}}> Click </button>
    }


  return (
    <div>
    <PageHeader/>

    TODO: Make this page {genBtn()}

    </div>
  )
}

export default SchoolRoutePage