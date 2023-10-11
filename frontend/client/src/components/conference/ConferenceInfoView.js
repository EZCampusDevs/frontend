import React from "react";
import ConferenceCalendarWrapper from "./ConferenceCalendarWrapper";

//This Component will

const ConferenceInfoView = ({ currentState }) => {
  
    const twitIcon = (
        <div class="d-flex flex-column align-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            viewBox="0 0 16 16"
            class="bi bi-twitter"
          >
            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"></path>
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

    const teamProfile_Factory = (name, position, icon, twitterLink, instaLink, facebookLink) => {
        return (
            <div className="col">
            <div className="card border-0 shadow-none">
              <div class="card border-0 shadow-none">
                <div class="card-body text-center d-flex flex-column align-items-center p-0">
                  <img
                    class="rounded-circle mb-3 fit-cover"
                    width="130"
                    height="130"
                    src="https://cdn.bootstrapstudio.io/placeholders/1400x800.png"
                  />
                  <h5 class="fw-bold text-primary card-title mb-0">
                    <strong>{name}</strong>
                  </h5>
                  <p class="text-muted card-text mb-2">{position}</p>
                  <ul class="list-inline fs-6 text-muted w-100 mb-0">
                    <li class="list-inline-item text-center" href={twitterLink}>{twitIcon}</li>
                    <li class="list-inline-item text-center" href={instaLink}>{igIcon}</li>
                    <li class="list-inline-item text-center" href={facebookLink}>{fbIcon}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
    }

    const talkingPoint_Factory = (title, textbody, call_to_action_caption, call_to_action_link, SVG_JSX) => {
      return (
        <div class="col">
        <div class="text-center d-flex flex-column align-items-center align-items-xl-center">
            <div class="bs-icon-lg bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon lg">
              
              {SVG_JSX}
            
            </div>
            
            <div class="px-3">
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
      return <li className="night_text btn btn-outline-primary mb-5" onClick={() => {setSVI(svi)}}>{text}</li>
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
                  Curae hendrerit donec commodo hendrerit egestas tempus, turpis
                  facilisis nostra nunc. Vestibulum dui eget ultrices.
                </p>

              </div>
            </div>

              <div className="row gy-4 row-cols-2 row-cols-md-4">
                {teamProfile_Factory("Employee 1", "Manager")}
                {teamProfile_Factory("Employee 2", "Member")}
                {teamProfile_Factory("Employee 3", "Member")}
                {teamProfile_Factory("Employee 4", "Member")}
                {teamProfile_Factory("Employee 10", "Manager")}
                {teamProfile_Factory("Employee 20", "Member")}
                {teamProfile_Factory("Employee 30", "Member")}
                {teamProfile_Factory("Employee 40", "Member")}
              </div>
          
          </div>
        }

        if(svi === 2){
            return <div class="container py-4 py-xl-5">
            <div class="row mb-5">
            <div className="col-md-8 col-xl-6 text-center mx-auto">
                
                <h2 className="night_text">Our Team</h2>
                
                <p className="w-lg-50 night_text">
                  Curae hendrerit donec commodo hendrerit egestas tempus, turpis
                  facilisis nostra nunc. Vestibulum dui eget ultrices.
                </p>

              </div>
            </div>

            <div class="row gy-4 row-cols-1 row-cols-md-2 row-cols-xl-3">

                {talkingPoint_Factory("Call to Action #1","blah blah blah","Learn More!", "https://google.com", <svg class="bi bi-bell" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"></path>
                </svg>
                )}

                {talkingPoint_Factory("Call to Action #1","blah blah blah","Learn More!", "https://google.com", <svg class="bi bi-bezier" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M0 10.5A1.5 1.5 0 0 1 1.5 9h1A1.5 1.5 0 0 1 4 10.5v1A1.5 1.5 0 0 1 2.5 13h-1A1.5 1.5 0 0 1 0 11.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm10.5.5A1.5 1.5 0 0 1 13.5 9h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM6 4.5A1.5 1.5 0 0 1 7.5 3h1A1.5 1.5 0 0 1 10 4.5v1A1.5 1.5 0 0 1 8.5 7h-1A1.5 1.5 0 0 1 6 5.5v-1zM7.5 4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"></path>
                                <path d="M6 4.5H1.866a1 1 0 1 0 0 1h2.668A6.517 6.517 0 0 0 1.814 9H2.5c.123 0 .244.015.358.043a5.517 5.517 0 0 1 3.185-3.185A1.503 1.503 0 0 1 6 5.5v-1zm3.957 1.358A1.5 1.5 0 0 0 10 5.5v-1h4.134a1 1 0 1 1 0 1h-2.668a6.517 6.517 0 0 1 2.72 3.5H13.5c-.123 0-.243.015-.358.043a5.517 5.517 0 0 0-3.185-3.185z"></path>
                            </svg>
                            )}

                {talkingPoint_Factory("Call to Action #1","blah blah blah","Learn More!", "https://google.com", <svg class="bi bi-flag" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21.294 21.294 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21.317 21.317 0 0 0 14 7.655V1.222z"></path>
                            </svg>
                            )}
            </div>
        </div>
        }

    }

    const AdditionalInfoView = () => { 
        return (
        <>
        <div className="container">
            <div className="row">
            <div className="col-md-8 col-xl-1">
                <ul>
                {SubViewMenuItem_Factory("About us", 1)}
                {SubViewMenuItem_Factory("About OTU", 2)}
                {SubViewMenuItem_Factory("About Oshawa", 3)}
                {SubViewMenuItem_Factory("Useful Links", 4)}
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
