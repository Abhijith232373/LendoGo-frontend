import React, { useState } from 'react';
import { useAuthController } from '../../../../../controllers/auth/useAuthController';
import "./CareersManagementTab.css";

const CareersManagementTab = ({ 
  careersOpenings, 
  handleToggleJobStatus, 
  jobApplications, 
  handleUpdateApplicantStatus,
  handleCreateJobOpening,
  handleUpdateJobOpening,
  showOnly // "applications" or "jobs"
}) => {
  const { user } = useAuthController();
  const p = user?.permissions || {};
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@gmail.com';
  const canJobCreate = isAdmin || !!p['career_job_create'];
  const canJobUpdate = isAdmin || !!p['career_job_update'];
  const canAppUpdate = isAdmin || !!p['career_app_update'];

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
  const [jobResps, setJobResps] = useState('');
  const [jobReqs, setJobReqs] = useState('');
  const [jobBens, setJobBens] = useState('');
  const [editJobId, setEditJobId] = useState(null);

  const handleEditJob = (job) => {
    setEditJobId(job.id);
    setJobTitle(job.title);
    setJobDept(job.dept);
    setJobType(job.type);
    setJobExp(job.experience);
    setJobLoc(job.location);
    setJobMode(job.mode);
    setJobSkills(Array.isArray(job.skills) ? job.skills.join(', ') : job.skills);
    setJobBrief(job.briefNote);
    setJobAbout(job.aboutRole);
    setJobResps(Array.isArray(job.responsibilities) ? job.responsibilities.join(', ') : job.responsibilities);
    setJobReqs(Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements);
    setJobBens(Array.isArray(job.benefits) ? job.benefits.join(', ') : job.benefits);
    setShowCreateModal(true);
  };

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

    const splitAndTrim = (str) => str.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const jobData = {
      title: jobTitle,
      department: jobDept,
      employment_type: jobType,
      experience_range: jobExp,
      location: jobLoc,
      work_mode: jobMode,
      skills: splitAndTrim(jobSkills),
      short_description: jobBrief,
      about_role: jobAbout,
      responsibilities: splitAndTrim(jobResps),
      requirements: splitAndTrim(jobReqs),
      benefits: splitAndTrim(jobBens)
    };

    if (editJobId) {
      handleUpdateJobOpening(editJobId, jobData);
    } else {
      handleCreateJobOpening(jobData);
    }

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
    setJobResps('');
    setJobReqs('');
    setJobBens('');
    setEditJobId(null);
    setShowCreateModal(false);
  };

  const handleActionClick = (id, name, email, targetStatus, role) => {
    handleUpdateApplicantStatus(id, name, targetStatus);
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

          {canJobCreate && (
            <button 
              className="btn-action-primary" 
              onClick={() => {
                setEditJobId(null);
                setJobTitle('');
                setJobDept('Product');
                setJobType('Full-Time');
                setJobExp('1-3 yrs');
                setJobLoc('');
                setJobMode('Hybrid');
                setJobSkills('');
                setJobBrief('');
                setJobAbout('');
                setJobResps('');
                setJobReqs('');
                setJobBens('');
                setShowCreateModal(true);
              }}
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
          )}
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
                  {canJobUpdate ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-action-toggle-job"
                        onClick={() => handleEditJob(job)}
                        style={{ backgroundColor: 'rgba(0, 102, 255, 0.1)', color: '#0066ff', border: '1px solid rgba(0, 102, 255, 0.2)' }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-action-toggle-job"
                        onClick={() => handleToggleJobStatus(job.id, job.title, job.status)}
                      >
                        {job.status === 'Open' ? 'Close' : 'Re-open'}
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-light)', fontStyle: 'italic' }}>View Only</span>
                  )}
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
                  {canAppUpdate ? (
                    app.status === 'Reviewing' || app.status === 'Interviewing' ? (
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
                    )
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-light)', fontStyle: 'italic' }}>View Only</span>
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

      {/* ── PREMIUM CREATE JOB OPENING MODAL ── */}
      {showCreateModal && (
        <div className="premium-modal-overlay animate-fade-in" onClick={() => setShowCreateModal(false)}>
          <div className="premium-modal-container scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="premium-modal-header">
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--admin-text)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.2), rgba(0, 82, 204, 0.1))', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0066ff' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {editJobId ? <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /> : <path d="M12 5v14M5 12h14" />}
                  </svg>
                </div>
                {editJobId ? 'Edit Job Opening' : 'Create New Job Opening'}
              </h3>
              <button 
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditJobId(null);
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--admin-text-light)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitJob}>
              <div className="premium-modal-body">
                
                {/* Section 1: Basic Information */}
                <div className="premium-form-section">
                  <div className="premium-form-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Basic Information
                  </div>
                  <div className="premium-grid-row">
                    <div className="premium-input-group" style={{ flex: 2 }}>
                      <label>Role Title *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Associate Product Manager" 
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                        className="premium-input"
                      />
                    </div>
                    <div className="premium-input-group" style={{ flex: 1 }}>
                      <label>Department *</label>
                      <select 
                        value={jobDept}
                        onChange={(e) => setJobDept(e.target.value)}
                        className="premium-input"
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
                  <div className="premium-grid-row">
                    <div className="premium-input-group">
                      <label>Location *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Ernakulam, Palarivattom" 
                        value={jobLoc}
                        onChange={(e) => setJobLoc(e.target.value)}
                        required
                        className="premium-input"
                      />
                    </div>
                    <div className="premium-input-group">
                      <label>Experience *</label>
                      <select 
                        value={jobExp}
                        onChange={(e) => setJobExp(e.target.value)}
                        className="premium-input"
                      >
                        <option value="Entry-level">Entry-level</option>
                        <option value="1-3 yrs">1-3 yrs</option>
                        <option value="3-5 yrs">3-5 yrs</option>
                        <option value="5+ yrs">5+ yrs</option>
                      </select>
                    </div>
                    <div className="premium-input-group">
                      <label>Job Mode *</label>
                      <select 
                        value={jobMode}
                        onChange={(e) => setJobMode(e.target.value)}
                        className="premium-input"
                      >
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Role Details */}
                <div className="premium-form-section">
                  <div className="premium-form-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                    </svg>
                    Role Details
                  </div>
                  <div className="premium-grid-row">
                    <div className="premium-input-group">
                      <label>Simple Brief Note *</label>
                      <textarea 
                        rows="2"
                        placeholder="A short card synopsis of the opening..." 
                        value={jobBrief}
                        onChange={(e) => setJobBrief(e.target.value)}
                        required
                        className="premium-input"
                      />
                    </div>
                  </div>
                  <div className="premium-grid-row">
                    <div className="premium-input-group">
                      <label>Detailed About the Role *</label>
                      <textarea 
                        rows="3"
                        placeholder="Write a comprehensive description of the role..." 
                        value={jobAbout}
                        onChange={(e) => setJobAbout(e.target.value)}
                        required
                        className="premium-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Requirements & Perks */}
                <div className="premium-form-section">
                  <div className="premium-form-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Requirements & Perks
                  </div>
                  <div className="premium-grid-row">
                    <div className="premium-input-group">
                      <label>Required Skills (Comma separated)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Product Thinking, SQL, Agile / Scrum" 
                        value={jobSkills}
                        onChange={(e) => setJobSkills(e.target.value)}
                        className="premium-input"
                      />
                    </div>
                    <div className="premium-input-group">
                      <label>Responsibilities (Comma separated)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Lead team, Write code, Code reviews" 
                        value={jobResps}
                        onChange={(e) => setJobResps(e.target.value)}
                        className="premium-input"
                      />
                    </div>
                  </div>
                  <div className="premium-grid-row">
                    <div className="premium-input-group">
                      <label>Requirements (Comma separated)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 5+ years Go, React experience" 
                        value={jobReqs}
                        onChange={(e) => setJobReqs(e.target.value)}
                        className="premium-input"
                      />
                    </div>
                    <div className="premium-input-group">
                      <label>Benefits (Comma separated)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Health Insurance, Remote work" 
                        value={jobBens}
                        onChange={(e) => setJobBens(e.target.value)}
                        className="premium-input"
                      />
                    </div>
                  </div>
                </div>

              </div>
              
              <div className="premium-modal-footer">
                <button 
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditJobId(null);
                  }}
                  className="btn-action-secondary"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--admin-text)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-action-primary"
                  style={{
                    background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {editJobId ? 'Update Job Opening' : 'Publish Job Opening'}
                </button>
              </div>
            </form>
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
            width: '90vw',
            height: '90vh',
            maxWidth: '1400px',
            backgroundColor: 'var(--admin-card)',
            border: '1px solid var(--admin-border)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            padding: '0',
            overflow: 'hidden',
            display: 'flex',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Absolute Close Button */}
            <button 
              onClick={() => setShowDetailsModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '1.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 10,
                backdropFilter: 'blur(4px)'
              }}
            >
              ×
            </button>

            {/* Left Pane - Profile Info */}
            <div style={{ 
              width: '400px', 
              minWidth: '400px',
              display: 'flex', 
              flexDirection: 'column', 
              borderRight: '1px solid var(--admin-border)', 
              backgroundColor: 'var(--admin-sidebar)', 
              overflowY: 'auto' 
            }}>
              {/* Header Banner */}
              <div style={{
                padding: '30px 24px',
                background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.15) 0%, rgba(0, 82, 204, 0.05) 100%)',
                borderBottom: '1px solid var(--admin-border)'
              }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: '800', 
                  textTransform: 'uppercase', 
                  color: '#0066ff', 
                  backgroundColor: 'rgba(0,102,255,0.1)', 
                  padding: '4px 10px', 
                  borderRadius: '6px',
                  letterSpacing: '0.5px'
                }}>
                  ID: {selectedApp.id.substring(0, 8)}...
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--admin-text)', margin: '12px 0 4px 0' }}>
                  {selectedApp.name}
                </h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--admin-text-light)' }}>
                  Target Role: <strong style={{ color: 'var(--admin-text)' }}>{selectedApp.role}</strong> ({selectedApp.dept})
                </span>
              </div>

              {/* Profile Grid Information */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                
                {/* Contact Information Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '14px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--admin-border)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Email Address</span>
                    <strong style={{ fontSize: '0.95rem', color: '#0066ff' }}>{selectedApp.email}</strong>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '14px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--admin-border)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Phone Number</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--admin-text)' }}>{selectedApp.phone || 'N/A'}</strong>
                  </div>
                </div>

                {/* Full Address details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '14px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--admin-border)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Residential Address</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--admin-text)', lineHeight: '1.4', marginTop: '2px' }}>
                    {selectedApp.address || 'Address not supplied'}
                  </strong>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.8rem', color: 'var(--admin-text-light)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                    <div>City: <strong style={{ color: 'var(--admin-text)' }}>{selectedApp.city || 'N/A'}</strong></div>
                    <div>State: <strong style={{ color: 'var(--admin-text)' }}>{selectedApp.state || 'N/A'}</strong></div>
                    <div>Zip: <strong style={{ color: 'var(--admin-text)' }}>{selectedApp.zip || 'N/A'}</strong></div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto', borderTop: '1px solid var(--admin-border)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-light)' }}>Applied Date:</span>
                    <strong style={{ fontSize: '0.85rem' }}>{selectedApp.applied}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-light)' }}>Current Status:</span>
                    <span className={`recru-status ${selectedApp.status.toLowerCase()}`}>{selectedApp.status}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Pane - PDF Viewer */}
            <div style={{ flex: 1, backgroundColor: '#1a1d24', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px 24px', backgroundColor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text)' }}>{selectedApp.cvName || 'Resume Document'}</strong>
                </div>
                <a 
                  href={selectedApp.cvUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.8rem', color: '#0066ff', textDecoration: 'none', fontWeight: '700' }}
                >
                  Open in New Tab ↗
                </a>
              </div>
              
              <div style={{ flex: 1, padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {selectedApp.cvUrl ? (
                  <iframe 
                    src={selectedApp.cvUrl} 
                    title="Applicant Resume"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--admin-text-light)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>No resume file found for this applicant.</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CareersManagementTab;
