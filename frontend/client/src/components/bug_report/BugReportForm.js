import React from "react";
import '../../static/css/bug_report.css'


const BugReportForm = () => {
    return (
        <form>
            <div className="bug-report">
                <label for="bug_report_title" className="report-label">Bug Report Title</label>
                <input type="text" className="form-control" placeholder="Enter bug report title"></input>
            </div>
            <div className="bug-report">
                <label for="bug_report_description" className="report-label">Bug Report Description</label>
                <textarea className="form-control" rows="3" placeholder="Describe the bug"></textarea>
            </div>
            <button type="submit" className="report-btn">Submit</button>
        </form>
        
    );
};

export default BugReportForm;