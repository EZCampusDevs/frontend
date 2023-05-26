import React from 'react'

//Component imports
import PageHeader from '../components/navbar/PageHeader'

const AboutUsPage = () => {

  const newContributor = (name, githubLink, contributions) => {
    return <div>
      <h5>{name}<a className="left_margin" href={githubLink} target="_blank"><img src="https://img.shields.io/badge/-GitHub-%233884FF?logo=GitHub&logoColor=black%22"/></a></h5>
      <h6 className="club_small_secondary">{contributions}</h6>
      <br/>
    </div>
  }



  return (
    <div className="club_page_body">
              <PageHeader/>
        <div className="cc_title_break">
                <h1>Our Team</h1>
                <h5 className="club_small_secondary">We're looking for devs!</h5>
        </div>

        <div className="cc_side_by_side">
            <div>

                <h2>Daniel Jeon <a className="left_margin" href="https://github.com/danielljeon" target="_blank"><img src="https://img.shields.io/badge/-GitHub-%233884FF?logo=GitHub&logoColor=black%22"/></a></h2>
                <h5 className="club_small_secondary">- Principal Backend / API Developer (FastAPI Routing & Pydantic Object Oriented Design in Python)</h5>
                <h5 className="club_small_secondary">- Principal SQL Developer (MySQL Connection, DB Initialization & Design)</h5>
                <h5 className="club_small_secondary">- Connection & Decoding to OTU's MyCampus, RateMyProfessor & Other APIs</h5>
                <h5 className="club_small_secondary">- Technical Lead, organizing backend tasks & organized program maps data gathering for contributors. </h5>
                <h5 className="club_small_secondary">- Calendar / ICS File Generation & Internal File Caching</h5>
                <h5 className="club_small_secondary">- Creator of the Optimizer's Algorithm (Time Validations, Preference & Algorithmic Speed Optimizations)</h5>
                <br/>
                <h5 className="club_small_secondary">- Bug testing & Bug reporting for frontend & API </h5>
                <h5 className="club_small_secondary">- UX , QOL Designer </h5>
                <h5 className="club_small_secondary">- DevOps / Production Administrator & Web-server configurations </h5>
                <h5 className="club_small_secondary">- Creator of the Original Schedulizer (ICS File Maker) Discord Bot 🤖</h5>
            </div>
    
            <div>

                <h2>Jason Manarroo <a className="left_margin" href="https://github.com/jasonmzx" target="_blank"><img src="https://img.shields.io/badge/-GitHub-%233884FF?logo=GitHub&logoColor=black%22"/></a></h2>
                <h5 className="club_small_secondary">- Principal Frontend Developer (React & Redux in Javascript, Design patterns)</h5>
                <h5 className="club_small_secondary">- Redux State Management (Integrated functionally in React & data validation is passed to Redux)</h5>
                <h5 className="club_small_secondary">- Backend / API Developer (User Authentication, Endpoint Optimization & Bugs)</h5>
                <h5 className="club_small_secondary">- Renderings & Visualizations for all components that run off API data</h5>
                <h5 className="club_small_secondary">- Viewport scalability & Device flexibility </h5>
                <h5 className="club_small_secondary">- Technical Lead, organizing frontend & UI related tasks for contributors. </h5>
                <h5 className="club_small_secondary">- Secondary SQL Developer (Minor Design & Tweaks)</h5>
                <h5 className="club_small_secondary">- Fullstack</h5>
                <br/>
                <h5 className="club_small_secondary">- Bug testing & Bug reporting for frontend & API</h5>
                <h5 className="club_small_secondary">- UI/UX , QOL Designer </h5>
                <h5 className="club_small_secondary">- DevOps / Production Administrator & Web-server configurations </h5>
            </div>

        </div>

        <div className="cc_cont">
        <h4 style={{textAlign : "text-center"}}>Contributors: </h4>
        {newContributor('"Minnowo"', "https://github.com/Minnowo", <>Wrote some regex data validation in Python <i>(our backend language)</i> in the early stages of this project.</>)}
        {newContributor("Ryan Don", "https://github.com/ryan-don31", "Wrote program maps for our Executive Planner.")}
        {newContributor("Ali Hakkani", "https://github.com/AliH7861", "Wrote program maps for our Executive Planner.")}
        {newContributor("Dmitri Rios Nadeau", "https://github.com/DemiwizAces", "Wrote program maps for our Executive Planner.")}
        {newContributor('"Loona"', "https://github.com/MonEmperor", "Wrote program maps for our Executive Planner.")}
        {newContributor('Tejush Badal', "https://github.com/TejushBadal", "Wrote program maps for our Executive Planner.")}
        </div>

        <div className="cc_cont">
        <h4>Are you interested in joining our team? </h4>
        <h5 className="club_small_secondary">That's great! We're looking for developers with some experience! Please join our discord server and dicuss your skills with us, we'd love to see what you can offer!</h5>
        <a href="https://discord.gg/rg2gPxrgbg" target="_blank">https://discord.gg/rg2gPxrgbg</a>


        </div>

    </div>
  )
}

export default AboutUsPage