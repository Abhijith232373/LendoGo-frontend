import React, { useState } from 'react';

const CareersManagementTab = ({ 
  careersOpenings, 
  handleToggleJobStatus, 
  jobApplications, 
  handleUpdateApplicantStatus,
  handleCreateJobOpening,
  showOnly // "applications" or "jobs"
}) => {
  const [jobStatusFilter, setJobStatusFilter] = useState('All');
  const [jobDeptFilter, setJobDeptFilter] = useState('All');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const [appDeptFilter, setAppDeptFilter] = useState('All');

  // Modal form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Product');
  const [jobType, setJobType] = useState('Full-Time');
  const [jobExp, setJobExp] = useState('1-3 yrs');
  const [jobLoc, setJobLoc] = useState('');
  const [jobMode, setJobMode] = useState('Hybrid');
  const [jobSkills, setJobSkills] = useState('');
  const [jobBrief, setJobBrief] = useState('');
  const [jobAbout, setJobAbout] = useState('');

  // Email Confirmation states
  const [showMailModal, setShowMailModal] = useState(false);
  const [mailDetails, setMailDetails] = useState({ id: '', name: '', email: '', status: '', role: '' });
  const [customMailSubject, setCustomMailSubject] = useState('');
  const [customMailBody, setCustomMailBody] = useState('');

  // Applicant Profile Details Modal states
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter job postings dynamically by status AND department
  const filteredJobs = careersOpenings.filter(job => {
    const matchStatus = jobStatusFilter === 'All' || job.status === jobStatusFilter;
    const matchDept = jobDeptFilter === 'All' || job.dept === jobDeptFilter;
    return matchStatus && matchDept;
  });

  // Filter applicant logs dynamically by status AND department
  const filteredApps = jobApplications.filter(app => {
    const matchStatus = appStatusFilter === 'All' || app.status === appStatusFilter;
    const matchDept = appDeptFilter === 'All' || app.dept === appDeptFilter;
    return matchStatus && matchDept;
  });

  const handleSubmitJob = (e) => {
    e.preventDefault();
    if (!jobTitle || !jobLoc || !jobBrief || !jobAbout) {
      return;
    }

    const skillsArray = jobSkills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    handleCreateJobOpening({
      title: jobTitle,
      dept: jobDept,
      type: jobType,
      experience: jobExp,
      location: jobLoc,
      mode: jobMode,
      skills: skillsArray,
      briefNote: jobBrief,
      aboutRole: jobAbout
    });

    // Reset Form
    setJobTitle('');
    setJobDept('Product');
    setJobType('Full-Time');
    setJobExp('1-3 yrs');
    setJobLoc('');
    setJobMode('Hybrid');
    setJobSkills('');
    setJobBrief('');
    setJobAbout('');
    setShowCreateModal(false);
  };

  const handleActionClick = (id, name, email, targetStatus, role) => {
    const defaultSubject = `LendoGo Recruitment - Application ${targetStatus}`;
    const defaultBody = targetStatus === 'Shortlisted' 
      ? `Dear ${name},\n\nWe are pleased to inform you that your application for the ${role} position has been shortlisted! Our human resources team will reach out shortly for interview scheduling.\n\nBest regards,\nLendoGo Recruitment Team`
      : `Dear ${name},\n\nThank you for your interest in LendoGo. We reviewed your application for the ${role} position carefully, but we have decided to move forward with other candidates at this time.\n\nBest regards,\nLendoGo Recruitment Team`;

    setMailDetails({ id, name, email, status: targetStatus, role });
    setCustomMailSubject(defaultSubject);
    setCustomMailBody(defaultBody);
    setShowMailModal(true);
  };

  const handleSendMailConfirm = () => {
    handleUpdateApplicantStatus(mailDetails.id, mailDetails.name, mailDetails.status);
    setShowMailModal(false);
  };

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setShowDetailsModal(true);
  };

  const renderJobsPanel = () => (
    <div className="sub-panel" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>Active Job Postings</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          
          {/* Department Filter */}
          <select 
            value={jobDeptFilter} 
            onChange={(e) => setJobDeptFilter(e.target.value)}
            className="form-input-admin"
            style={{
              width: '155px',
              padding: '4px 10px',
              height: '34px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              backgroundColor: 'var(--admin-input)',
              border: '1px solid var(--admin-border)',
              color: 'var(--admin-text)'
            }}
          >
            <option value="All">All Departments</option>
            <option value="Product">Product</option>
            <option value="Operations">Operations</option>
            <option value="Credit & Risk">Credit & Risk</option>
            <option value="Engineering">Engineering</option>
            <option value="Data">Data</option>
            <option value="Design">Design</option>
          </select>

          {/* Status Filter */}
          <select 
            value={jobStatusFilter} 
            onChange={(e) => setJobStatusFilter(e.target.value)}
            className="form-input-admin"
            style={{
              width: '145px',
              padding: '4px 10px',
              height: '34px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              backgroundColor: 'var(--admin-input)',
              border: '1px solid var(--admin-border)',
              color: 'var(--admin-text)'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>

          <button 
            className="btn-action-primary" 
            onClick={() => setShowCreateModal(true)}
            style={{
              height: '34px',
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              border: 'none',
              background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
              color: '#fff',
              boxShadow: '0 2px 6px rgba(0,102,255,0.2)'
            }}
          >
            + Create Job Opening
          </button>
        </div>
      </div>

      <table className="admin-data-table mini-table">
        <thead>
          <tr>
            <th>Job Code</th>
            <th>Role Title</th>
            <th>Department</th>
            <th>Work Mode</th>
            <th>Experience</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <tr key={job.id}>
                <td><strong>{job.id}</strong></td>
                <td>
                  <div>
                    <strong>{job.title}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-light)', marginTop: '2px' }}>{job.location || 'Ernakulam, Palarivattom'}</div>
                  </div>
                </td>
                <td>{job.dept}</td>
                <td>
                  <span style={{ 
                    padding: '3px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--admin-border)',
                    color: 'var(--admin-text)'
                  }}>
                    {job.mode || 'Hybrid'}
                  </span>
                </td>
                <td>{job.experience || '1-3 yrs'}</td>
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
            ))
          ) : (
            <tr>
              <td colSpan="7" className="empty-row-text" style={{ padding: '24px', textAlign: 'center', color: 'var(--admin-text-light)', fontSize: '0.88rem' }}>
                No job postings match selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderAppsPanel = () => (
    <div className="sub-panel" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>Received Applications</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          
          {/* Department Filter */}
          <select 
            value={appDeptFilter} 
            onChange={(e) => setAppDeptFilter(e.target.value)}
            className="form-input-admin"
            style={{
              width: '155px',
              padding: '4px 10px',
              height: '34px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              backgroundColor: 'var(--admin-input)',
              border: '1px solid var(--admin-border)',
              color: 'var(--admin-text)'
            }}
          >
            <option value="All">All Departments</option>
            <option value="Product">Product</option>
            <option value="Operations">Operations</option>
            <option value="Credit & Risk">Credit & Risk</option>
            <option value="Engineering">Engineering</option>
            <option value="Data">Data</option>
            <option value="Design">Design</option>
          </select>

          {/* Status Filter */}
          <select 
            value={appStatusFilter} 
            onChange={(e) => setAppStatusFilter(e.target.value)}
            className="form-input-admin"
            style={{
              width: '155px',
              padding: '4px 10px',
              height: '34px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              backgroundColor: 'var(--admin-input)',
              border: '1px solid var(--admin-border)',
              color: 'var(--admin-text)'
            }}
          >
            <option value="All">All Applications</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <table className="admin-data-table mini-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Target Role</th>
            <th>Department</th>
            <th>Applied Date</th>
            <th>Progress Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredApps.length > 0 ? (
            filteredApps.map(app => (
              <tr key={app.id}>
                <td>
                  <div className="applicant-profile-cell">
                    <strong 
                      onClick={() => handleViewDetails(app)} 
                      style={{ cursor: 'pointer', color: '#0066ff', textDecoration: 'underline' }}
                      title="View Applicant Profile & CV"
                    >
                      {app.name}
                    </strong>
                    <span>{app.email}</span>
                  </div>
                </td>
                <td>{app.role}</td>
                <td>
                  <span style={{ 
                    padding: '3px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--admin-border)',
                    color: 'var(--admin-text)'
                  }}>
                    {app.dept || 'Operations'}
                  </span>
                </td>
                <td>{app.applied}</td>
                <td>
                  <span className={`recru-status ${app.status.toLowerCase()}`}>{app.status}</span>
                </td>
                <td>
                  {app.status === 'Reviewing' || app.status === 'Interviewing' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-action-primary" 
                        style={{ 
                          padding: '5px 12px', 
                          fontSize: '0.78rem', 
                          fontWeight: '700',
                          borderRadius: '6px', 
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                          color: '#fff', 
                          border: 'none', 
                          cursor: 'pointer'
                        }}
                        onClick={() => handleActionClick(app.id, app.name, app.email, 'Shortlisted', app.role)}
                      >
                        Shortlist
                      </button>
                      <button 
                        className="btn-action-secondary" 
                        style={{ 
                          padding: '5px 12px', 
                          fontSize: '0.78rem', 
                          fontWeight: '700',
                          borderRadius: '6px', 
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                          color: '#fff', 
                          border: 'none', 
                          cursor: 'pointer'
                        }}
                        onClick={() => handleActionClick(app.id, app.name, app.email, 'Rejected', app.role)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : app.status === 'Shortlisted' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '700' }}>✓ Shortlisted</span>
                      <button 
                        style={{ 
                          padding: '4px 8px', 
                          fontSize: '0.75rem', 
                          borderRadius: '6px', 
                          background: 'rgba(239, 68, 68, 0.1)', 
                          color: '#ef4444', 
                          border: '1px solid rgba(239, 68, 68, 0.2)', 
                          cursor: 'pointer' 
                        }}
                        onClick={() => handleActionClick(app.id, app.name, app.email, 'Rejected', app.role)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '700' }}>✕ Rejected</span>
                      <button 
                        style={{ 
                          padding: '4px 8px', 
                          fontSize: '0.75rem', 
                          borderRadius: '6px', 
                          background: 'rgba(16, 185, 129, 0.1)', 
                          color: '#10b981', 
                          border: '1px solid rgba(16, 185, 129, 0.2)', 
                          cursor: 'pointer' 
                        }}
                        onClick={() => handleActionClick(app.id, app.name, app.email, 'Shortlisted', app.role)}
                      >
                        Shortlist
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty-row-text" style={{ padding: '24px', textAlign: 'center', color: 'var(--admin-text-light)', fontSize: '0.88rem' }}>
                No candidate applications match selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row">
        <h2>{showOnly === 'jobs' ? 'Careers & Staff Openings' : 'Staff Recruitment Directory'}</h2>
      </div>

      {showOnly ? (
        <div style={{ width: '100%', marginTop: '15px' }}>
          {showOnly === 'jobs' ? renderJobsPanel() : renderAppsPanel()}
        </div>
      ) : (
        <div className="double-subtab-container">
          {renderJobsPanel()}
          {renderAppsPanel()}
        </div>
      )}

      {/* ── CREATE JOB OPENING MODAL ── */}
      {showCreateModal && (
        <div className="admin-modal-overlay animate-fade-in" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 8, 15, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999
        }} onClick={() => setShowCreateModal(false)}>
          
          <div className="admin-modal-container scale-up" style={{
            width: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: 'var(--admin-sidebar)',
            border: '1px solid var(--admin-border)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          }} onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header" style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--admin-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.01)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--admin-text)', margin: 0 }}>
                Create New Job Opening
              </h3>
              <button 
                className="close-btn" 
                onClick={() => setShowCreateModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--admin-text-light)',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >×</button>
            </div>

            <form onSubmit={handleSubmitJob} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Role Title & Area */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Role Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Associate Product Manager" 
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                    className="form-input-admin"
                    style={{ height: '38px', borderRadius: '8px', padding: '0 12px' }}
                  />
                </div>
                <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Area / Department *</label>
                  <select 
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    className="form-input-admin"
                    style={{ height: '38px', borderRadius: '8px', padding: '0 10px', cursor: 'pointer' }}
                  >
                    <option value="Product">Product</option>
                    <option value="Operations">Operations</option>
                    <option value="Credit & Risk">Credit & Risk</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Data">Data</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>

              {/* Exp, Location, and Work Mode */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Location *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ernakulam, Palarivattom" 
                    value={jobLoc}
                    onChange={(e) => setJobLoc(e.target.value)}
                    required
                    className="form-input-admin"
                    style={{ height: '38px', borderRadius: '8px', padding: '0 12px' }}
                  />
                </div>
                <div style={{ width: '130px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Experience *</label>
                  <select 
                    value={jobExp}
                    onChange={(e) => setJobExp(e.target.value)}
                    className="form-input-admin"
                    style={{ height: '38px', borderRadius: '8px', padding: '0 10px', cursor: 'pointer' }}
                  >
                    <option value="Entry-level">Entry-level</option>
                    <option value="1-3 yrs">1-3 yrs</option>
                    <option value="3-5 yrs">3-5 yrs</option>
                    <option value="5+ yrs">5+ yrs</option>
                  </select>
                </div>
                <div style={{ width: '130px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Job Mode *</label>
                  <select 
                    value={jobMode}
                    onChange={(e) => setJobMode(e.target.value)}
                    className="form-input-admin"
                    style={{ height: '38px', borderRadius: '8px', padding: '0 10px', cursor: 'pointer' }}
                  >
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              {/* Skills Comma Separated */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Most Needed Skills (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Product Thinking, SQL, Agile / Scrum, Data Analysis" 
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  className="form-input-admin"
                  style={{ height: '38px', borderRadius: '8px', padding: '0 12px' }}
                />
              </div>

              {/* Simple Brief Note */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Simple Brief Note *</label>
                <textarea 
                  rows="2"
                  placeholder="A short card synopsis of the opening..." 
                  value={jobBrief}
                  onChange={(e) => setJobBrief(e.target.value)}
                  required
                  className="form-input-admin"
                  style={{ borderRadius: '8px', padding: '10px 12px', fontSize: '0.88rem', resize: 'vertical' }}
                />
              </div>

              {/* Big Detailed About Role */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Detailed About the Role & Responsibilities *</label>
                <textarea 
                  rows="5"
                  placeholder="Write a comprehensive description of the role responsibilities, requirements, and offerings..." 
                  value={jobAbout}
                  onChange={(e) => setJobAbout(e.target.value)}
                  required
                  className="form-input-admin"
                  style={{ borderRadius: '8px', padding: '10px 12px', fontSize: '0.88rem', resize: 'vertical' }}
                />
              </div>

              {/* Form Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', borderTop: '1px solid var(--admin-border)', paddingTop: '16px' }}>
                <button 
                  type="button" 
                  className="btn-action-secondary" 
                  onClick={() => setShowCreateModal(false)}
                  style={{ height: '38px', borderRadius: '8px', padding: '0 18px', fontWeight: '700' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-action-primary"
                  style={{
                    height: '38px',
                    borderRadius: '8px',
                    padding: '0 20px',
                    fontWeight: '800',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(0,102,255,0.3)',
                    cursor: 'pointer'
                  }}
                >
                  ✓ Submit Opening
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── EMAIL DRAFT, EDITABLE & SEND MODAL ── */}
      {showMailModal && (
        <div className="admin-modal-overlay animate-fade-in" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 8, 15, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowMailModal(false)}>
          
          <div className="admin-modal-container scale-up" style={{
            width: '550px',
            backgroundColor: 'var(--admin-sidebar)',
            border: '1px solid var(--admin-border)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
            padding: '24px',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: mailDetails.status === 'Shortlisted' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto 12px auto'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={mailDetails.status === 'Shortlisted' ? '#10b981' : '#ef4444'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--admin-text)', margin: 0 }}>
                Edit & Send Notification Email
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-light)', marginTop: '4px' }}>
                Drafting communication for <strong>{mailDetails.email}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              
              {/* Recipient Details (To) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>To:</label>
                <input 
                  type="text" 
                  disabled
                  value={`${mailDetails.name} <${mailDetails.email}>`}
                  className="form-input-admin"
                  style={{ height: '34px', borderRadius: '6px', padding: '0 10px', opacity: 0.7 }}
                />
              </div>

              {/* Subject (Editable) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Subject:</label>
                <input 
                  type="text" 
                  value={customMailSubject}
                  onChange={(e) => setCustomMailSubject(e.target.value)}
                  className="form-input-admin"
                  style={{ height: '36px', borderRadius: '6px', padding: '0 10px' }}
                />
              </div>

              {/* Body (Editable Area) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Email Body:</label>
                <textarea 
                  rows="9"
                  value={customMailBody}
                  onChange={(e) => setCustomMailBody(e.target.value)}
                  className="form-input-admin"
                  style={{ borderRadius: '8px', padding: '12px', fontSize: '0.85rem', fontFamily: 'monospace', resize: 'vertical', lineHeight: '1.4' }}
                />
              </div>

            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--admin-border)', paddingTop: '16px' }}>
              <button 
                className="btn-action-secondary" 
                onClick={() => setShowMailModal(false)}
                style={{
                  height: '38px',
                  borderRadius: '8px',
                  padding: '0 18px',
                  fontWeight: '700'
                }}
              >
                Close / Cancel
              </button>
              <button 
                className="btn-action-primary" 
                onClick={handleSendMailConfirm}
                style={{
                  height: '38px',
                  borderRadius: '8px',
                  padding: '0 20px',
                  fontWeight: '800',
                  border: 'none',
                  background: mailDetails.status === 'Shortlisted' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: mailDetails.status === 'Shortlisted' ? '0 4px 12px rgba(16,185,129,0.3)' : '0 4px 12px rgba(239,68,68,0.3)'
                }}
              >
                Send Mail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── APPLICANT PROFILE DETAILS MODAL ── */}
      {showDetailsModal && selectedApp && (
        <div className="admin-modal-overlay animate-fade-in" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 8, 15, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowDetailsModal(false)}>
          
          <div className="admin-modal-container scale-up" style={{
            width: '580px',
            backgroundColor: 'var(--admin-sidebar)',
            border: '1px solid var(--admin-border)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
            padding: '0',
            overflow: 'hidden'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Header Banner */}
            <div style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.15) 0%, rgba(0, 82, 204, 0.05) 100%)',
              borderBottom: '1px solid var(--admin-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: '800', 
                  textTransform: 'uppercase', 
                  color: '#0066ff', 
                  backgroundColor: 'rgba(0,102,255,0.1)', 
                  padding: '3px 8px', 
                  borderRadius: '4px',
                  letterSpacing: '0.5px'
                }}>
                  {selectedApp.id}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--admin-text)', margin: '8px 0 2px 0' }}>
                  {selectedApp.name}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-light)' }}>
                  Applying for <strong>{selectedApp.role}</strong> ({selectedApp.dept})
                </span>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--admin-text-light)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >×</button>
            </div>

            {/* Profile Grid Information */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Contact Information Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--admin-border)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Email Address</span>
                  <strong style={{ fontSize: '0.88rem', color: '#0066ff' }}>{selectedApp.email}</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--admin-border)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Phone Number</span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--admin-text)' }}>{selectedApp.phone || '98765 43210'}</strong>
                </div>
              </div>

              {/* Full Address details from Apply UI */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--admin-border)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Residential Address</span>
                <strong style={{ fontSize: '0.88rem', color: 'var(--admin-text)', lineHeight: '1.4' }}>
                  {selectedApp.address || 'Street / Apartment details not supplied'}
                </strong>
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.78rem', color: 'var(--admin-text-light)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
                  <div>City: <strong style={{ color: 'var(--admin-text)' }}>{selectedApp.city || 'Ernakulam'}</strong></div>
                  <div>State: <strong style={{ color: 'var(--admin-text)' }}>{selectedApp.state || 'Kerala'}</strong></div>
                  <div>Zip Code: <strong style={{ color: 'var(--admin-text)' }}>{selectedApp.zip || '682025'}</strong></div>
                </div>
              </div>

              {/* Uploaded CV & PDF Document Viewer Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Candidate Resume / CV</span>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0,102,255,0.02)',
                  border: '1px dashed var(--admin-border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(0, 102, 255, 0.1)', color: '#0066ff' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--admin-text)', display: 'block' }}>{selectedApp.cvName || 'cv_resume.pdf'}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)' }}>PDF Document • 1.4 MB • Uploaded via LendoGo Jobs</span>
                  </div>
                  <button 
                    type="button" 
                    className="btn-action-primary" 
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                      color: '#fff',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,102,255,0.2)'
                    }}
                    onClick={() => alert(`Initiating secure view/download for candidate CV: ${selectedApp.cvName || 'cv_resume.pdf'}`)}
                  >
                    View CV
                  </button>
                </div>
              </div>

              {/* Summary Stats */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid var(--admin-border)', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-light)' }}>
                  Applied Date: <strong>{selectedApp.applied}</strong>
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-light)' }}>
                  Application Status: <span className={`recru-status ${selectedApp.status.toLowerCase()}`} style={{ marginLeft: '4px' }}>{selectedApp.status}</span>
                </span>
              </div>

            </div>

            {/* Footer buttons */}
            <div style={{
              padding: '16px 24px',
              backgroundColor: 'rgba(255,255,255,0.01)',
              borderTop: '1px solid var(--admin-border)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button 
                type="button" 
                className="btn-action-secondary" 
                onClick={() => setShowDetailsModal(false)}
                style={{ height: '36px', borderRadius: '8px', padding: '0 20px', fontWeight: '700' }}
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CareersManagementTab;
