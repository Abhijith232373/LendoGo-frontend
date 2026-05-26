import React from 'react';

const CareersManagementTab = ({ 
  careersOpenings, 
  handleToggleJobStatus, 
  jobApplications, 
  handleUpdateApplicantStatus 
}) => {
  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row">
        <h2>Careers & Staff Recruitment</h2>
        <p>Create mock openings and review candidate applications for LendoGo operations.</p>
      </div>

      <div className="double-subtab-container">
        <div className="sub-panel">
          <h3>Active Job Postings</h3>
          <table className="admin-data-table mini-table">
            <thead>
              <tr>
                <th>Job Code</th>
                <th>Role Title</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {careersOpenings.map(job => (
                <tr key={job.id}>
                  <td><strong>{job.id}</strong></td>
                  <td>{job.title}</td>
                  <td>{job.dept}</td>
                  <td>
                    <span className={`status-tag ${job.status.toLowerCase()}`}>{job.status}</span>
                  </td>
                  <td>
                    <button 
                      className="btn-action-toggle-job"
                      onClick={() => handleToggleJobStatus(job.id, job.title, job.status)}
                    >
                      {job.status === 'Open' ? 'Close' : 'Reopen'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sub-panel">
          <h3>Received Applications</h3>
          <table className="admin-data-table mini-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Target Role</th>
                <th>Applied Date</th>
                <th>Progress Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobApplications.map(app => (
                <tr key={app.id}>
                  <td>
                    <div className="applicant-profile-cell">
                      <strong>{app.name}</strong>
                      <span>{app.email}</span>
                    </div>
                  </td>
                  <td>{app.role}</td>
                  <td>{app.applied}</td>
                  <td>
                    <span className={`recru-status ${app.status.toLowerCase()}`}>{app.status}</span>
                  </td>
                  <td>
                    <select 
                      className="applicant-status-select"
                      value={app.status}
                      onChange={(e) => handleUpdateApplicantStatus(app.id, app.name, e.target.value)}
                    >
                      <option value="Reviewing">Reviewing</option>
                      <option value="Shortlisted">Shortlist</option>
                      <option value="Interviewing">Interview</option>
                      <option value="Rejected">Reject</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CareersManagementTab;
