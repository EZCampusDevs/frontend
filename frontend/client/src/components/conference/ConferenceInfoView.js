import React from "react";
import ConferenceCalendarWrapper from "./ConferenceCalendarWrapper";

//* Static Imports for FYIC

import Abida from '../../static/fyic/Abida.jpeg';
import Ali from '../../static/fyic/Ali.jpeg';
 import Blake from '../../static/fyic/Blake.jpg';
 import Siobhan from '../../static/fyic/Siobhan.JPG'
 import Fiona from '../../static/fyic/Fiona.jpg';
 import Nassim from '../../static/fyic/Nassim.JPG';

const ConferenceInfoView = ({ currentState }) => {
  
    const linkedInIcon = (
        <div class="d-flex flex-column align-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="bi bi-linkedin"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>
      );
      const igIcon = (
        <div class="d-flex flex-column align-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            viewBox="0 0 16 16"
            class="bi bi-instagram"
          >
            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"></path>
          </svg>
        </div>
      );
      const fbIcon = (
        <div class="d-flex flex-column align-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            viewBox="0 0 16 16"
            class="bi bi-facebook"
          >
            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path>
          </svg>
        </div>
      );

    const [subViewInt, setSVI] = React.useState(1); //Sub view for "Additional Options" tab
    
//##################################################
//##     Element Factories                        ##
//##################################################

    const teamProfile_Factory = (name, position, linkedInLink, IMAGE_SOURCE) => {
        return (
            <div className="col">
            <div className="card border-0 shadow-none">
              <div class="card border-0 shadow-none">
                <div class="card-body text-center d-flex flex-column align-items-center p-0">
                  <img
                    className="card-img-top profile-image"
                    width="130"
                    height="130"
                    src={IMAGE_SOURCE}
                  />
                  <h5 class="fw-bold text-primary card-title mb-0">
                    <strong>{name}</strong>
                  </h5>
                  <p class="text-muted card-text mb-2">{position}</p>
                  <ul class="list-inline fs-6 text-muted w-100 mb-0">
                    <li class="list-inline-item text-center" href={linkedInLink}>{linkedInIcon}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
    }

    const talkingPoint_Factory = (title, textbody, call_to_action_caption, call_to_action_link, SVG_JSX) => {
      return (
        <div class="col">
        <div class="text-center d-flex flex-column align-items-center align-items-xl-center">
            <div class="bs-icon-lg bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon lg">
              
              {SVG_JSX}
            
            </div>
            
            <div class="px-3 night_text">
                <h4>{title}</h4>
                <p>{textbody}</p>
                
                {/* Call to Action */}

                  <a target="_blank" rel="noreferrer" href={call_to_action_link}>
                  {call_to_action_caption}
                  </a>

            </div>
        </div>
    </div>
      );
    }

    const SubViewMenuItem_Factory = (text,svi) => {
      return <li className="night_text btn btn-outline-primary mb-5 w-full" onClick={() => {setSVI(svi)}}>{text}</li>
    }


//?##################################################
//?##     MAIN SUBVIEW SWITCH                      ##
//?##################################################

    const subViewSWITCH = (svi) => {

        if(svi === 1) {
            return <div className="container py-4 py-xl-5">
            
            <div className="row mb-4 mb-lg-5">
              <div className="col-md-8 col-xl-6 text-center mx-auto">
                
                <h2 className="night_text">Our Team</h2>
                
                <p className="w-lg-50 night_text">
                Our dedicated team of engineering students from OntarioTech University's First Year Integration Conference (FYIC) 
                organizing committee has tirelessly worked with unwavering passion and commitment to bring this extraordinary conference to first-year engineering students 
                from across Canada. Through collaboration, innovation, and hard work, we've created an inspiring platform where young engineers can connect, learn, and flourish.
                Join us at FYIC, where our diverse talents and shared vision come together to empower the next generation of engineers.
                </p>

              </div>
            </div>

              <div className="row gy-4 row-cols-2 row-cols-md-4">
                {teamProfile_Factory("Fiona Kirby", "Co-Chair", "", Fiona)}
                {teamProfile_Factory("Siobhan Anderson", "Co-Chair", "", Siobhan)}
                {teamProfile_Factory("Blake Pezzarello", "VP Finance", "", Blake)}
                {teamProfile_Factory("Abida Choudhury", "VP Logistics", "", Abida)}
                {teamProfile_Factory("Nassim Assaf", "VP Marketing", "", Nassim)}
                {teamProfile_Factory("Ali Hakkani", "VP Marketing", "", Ali)}
              </div>
          
          </div>
        }

        if(svi === 2){
            return <div class="container py-4 py-xl-5">
            <div class="row mb-5">
            <div className="col-md-8 col-xl-6 text-center mx-auto">
                
                <h2 className="night_text">About FYIC 2023</h2>
                
                <p className="w-lg-50 night_text">
                The Ontario Society of Professional Engineers (OSPE) is hosting the First Year Integration Conference (FYIC) on our campus in November 2023. The FYIC is an annual event designed to integrate first-year students into student leadership roles. For this year's conference, Ontario Tech has been granted the opportunity to host it. The primary aim is to ensure that every student who attends gains a clear understanding of the responsibilities of engineers towards the environment and how to lead while prioritizing these values.
                </p>

              </div>
            </div>
        </div>
        }

        if(svi === 3){
          return <div class="container py-4 py-xl-5">
          <div class="row mb-5">
          <div className="col-md-8 col-xl-6 text-center mx-auto">
              
              <h2 className="night_text">About Ontario Tech University</h2>
              
              <p className="w-lg-50 night_text">
              The Ontario Society of Professional Engineers (OSPE) is hosting the First Year Integration Conference (FYIC) on our campus in November 2023. The FYIC is an annual event designed to integrate first-year students into student leadership roles. For this year's conference, Ontario Tech has been granted the opportunity to host it. The primary aim is to ensure that every student who attends gains a clear understanding of the responsibilities of engineers towards the environment and how to lead while prioritizing these values.
              </p>

            </div>
          </div>

          {/* <div class="row gy-4 row-cols-1 row-cols-md-2 row-cols-xl-3">

              {talkingPoint_Factory("Call to Action #1","blah blah blah","Learn More!", "https://google.com", <svg class="bi bi-bell" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"></path>
              </svg>
              )}
          </div> */}

      </div>
        }

    }

    const AdditionalInfoView = () => { 
        return (
        <>
        <div className="container">
            <div className="row">
            <div className="col-md-8 col-xl-2">
                <ul>
                {SubViewMenuItem_Factory("Our Team", 1)}
                {SubViewMenuItem_Factory("About FYIC 2023", 2)}
                {SubViewMenuItem_Factory("About Ontario Tech", 3)}
                </ul>
            </div>
            <div className="col-md-6 col-xl-10">
                {subViewSWITCH(subViewInt)}

            </div>
            </div>
        </div>
        </>
    );
    }


  const CalendarInfoView = "";

  return <>
  {currentState == true ? <ConferenceCalendarWrapper/> : AdditionalInfoView()}

  </>;
};

export default ConferenceInfoView;
