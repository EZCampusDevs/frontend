import React from "react";
import '../static/css/main_ui.css'
import '../static/css/bug_report.css'

//Component imports
import PageHeader from "../components/navbar/PageHeader";
import BugReportForm from "../components/bug_report/BugReportForm";

const BugReportPage = () => {
  return (
    <div className="club_page_body">
      <PageHeader />
      <div className="cc_title_break">
        <h1>Bug Report</h1>
        <h5 className="club_small_secondary">
          Please fill out the form below to report a bug
        </h5>
        <BugReportForm />
      </div>
    </div>
  );
}

export default BugReportPage;