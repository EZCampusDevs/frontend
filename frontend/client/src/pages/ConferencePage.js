import React from "react";
import PageHeader from "../components/navbar/PageHeader";
import ConferenceInfoView from "../components/conference/ConferenceInfoView";

import fyicLogo from '../static/images/FYIC.webp'

const ConferencePage = () => {
  //React State
  const [mainView, setMainView] = React.useState("");

  return (
    <>
      <PageHeader />
      <div className="container-fluid">
      <div className="row">
        <div className="col">
          <section className="py-4 py-xl-5">
            <div className="container">
              <div className="text-white bg-dark border rounded border-0 p-4 p-md-5">
                <h2 className="fw-bold text-white mb-3">FYIC</h2>
                <div
    data-bss-parallax-bg="true"
    style={{
        height: "500px",
        backgroundImage: `url(${fyicLogo})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
    }}
></div>
                <p className="mb-4">This event is powered by EZCampus</p>
                <button onClick={() => {setMainView(true)}}
                  className="btn btn-light btn-lg"
                  style={{ margin: "5px" }}
                >
                  Schedule
                </button>
                <button onClick={() => {setMainView(false)}}
                className="btn btn-primary btn-lg me-2">
                  Additional Information
                </button>
              </div>
            </div>
          </section>
        </div>

        <ConferenceInfoView currentState={mainView} />


      </div>
      </div>
    </>
  );
};

export default ConferencePage;
