import React from 'react';

const AssignRolesTab = ({ 
  handleAddStaff, 
  newStaffName, 
  setNewStaffName, 
  newStaffEmail, 
  setNewStaffEmail, 
  newStaffRole, 
  setNewStaffRole, 
  staffMembers,
  handleUpdateStaffRole
}) => {
  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row">
        <h2>Assign Staff Roles & Clearances</h2>
        <p>Assign administrative levels, verify access clearance standards, and provision new staff profiles for operational lending.</p>
      </div>

      <div className="double-subtab-container" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Create/Provision Form */}
        <div className="sub-panel flex-1" style={{ flex: '1 1 300px', backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-card-border)', borderRadius: '24px', padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '20px', color: 'var(--admin-text)' }}>Provision New Employee</h3>
          <form className="staff-form" onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-light)' }}>Employee Full Name</label>
              <input 
                type="text" 
                required
                value={newStaffName} 
                onChange={(e) => setNewStaffName(e.target.value)} 
                placeholder="e.g. Anand Sharma" 
                className="topbar-search-input"
                style={{ backgroundColor: 'var(--admin-input)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '12px', color: 'var(--admin-text)' }}
              />
            </div>
            <div className="form-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-light)' }}>LendoGo Office Email</label>
              <input 
                type="email" 
                required
                value={newStaffEmail} 
                onChange={(e) => setNewStaffEmail(e.target.value)} 
                placeholder="e.g. anand.s@lendogo.com" 
                className="topbar-search-input"
                style={{ backgroundColor: 'var(--admin-input)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '12px', color: 'var(--admin-text)' }}
              />
            </div>
            <div className="form-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-light)' }}>Assigned Staff Role</label>
              <select 
                value={newStaffRole} 
                onChange={(e) => setNewStaffRole(e.target.value)}
                className="topbar-search-input"
                style={{ backgroundColor: 'var(--admin-input)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '12px', color: 'var(--admin-text)', outline: 'none' }}
              >
                <option value="Verification Agent">Verification Agent (L1 Ops)</option>
                <option value="Credit Underwriter">Credit Underwriter (L2 Compliance)</option>
                <option value="Lending Officer">Lending Officer (L3 Admin)</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="btn-decision approve" 
              style={{ padding: '14px', borderRadius: '12px', marginTop: '10px' }}
            >
              ＋ Provision Team Account
            </button>
          </form>
        </div>

        {/* Directory & Dynamic Assignment List */}
        <div className="sub-panel flex-2" style={{ flex: '2 1 500px', backgroundColor: 'var(--admin-card)', border: '1px solid var(--admin-card-border)', borderRadius: '24px', padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '20px', color: 'var(--admin-text)' }}>Clearance Directories</h3>
          <div className="table-responsive-admin" style={{ border: 'none', boxShadow: 'none' }}>
            <table className="admin-data-table mini-table">
              <thead>
                <tr>
                  <th>Staff Officer</th>
                  <th>Security Clearance</th>
                  <th>Dynamic Role Assignment</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((staff, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="user-profile-cell">
                        <span className="user-cell-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                          </svg>
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ fontSize: '0.88rem', color: 'var(--admin-text)' }}>{staff.name}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)' }}>{staff.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`risk-tag ${staff.role === 'Lending Officer' ? 'high-risk' : staff.role === 'Credit Underwriter' ? 'medium-risk' : 'low-risk'}`} style={{ textTransform: 'uppercase', fontSize: '0.72rem' }}>
                        {staff.clearance}
                      </span>
                    </td>
                    <td>
                      <select
                        value={staff.role}
                        onChange={(e) => handleUpdateStaffRole(staff.email, e.target.value)}
                        className="topbar-search-input"
                        style={{
                          backgroundColor: 'var(--admin-input)',
                          border: '1px solid var(--admin-border)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          color: 'var(--admin-text)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          width: '180px',
                          outline: 'none'
                        }}
                      >
                        <option value="Verification Agent">Verification Agent (L1)</option>
                        <option value="Credit Underwriter">Credit Underwriter (L2)</option>
                        <option value="Lending Officer">Lending Officer (L3)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignRolesTab;
