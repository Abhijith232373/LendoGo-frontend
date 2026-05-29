import React from 'react';

const StaffManagementTab = ({ 
  handleAddStaff, 
  newStaffName, 
  setNewStaffName, 
  newStaffEmail, 
  setNewStaffEmail, 
  newStaffRole, 
  setNewStaffRole, 
  staffMembers 
}) => {
  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row">
        <h2>Staff Accounts & Permissions</h2>
        <p>Manage operating lending credentials, compliance officer clearances, and staff audits.</p>
      </div>

      <div className="double-subtab-container">
        <div className="sub-panel flex-1">
          <h3>Add New Operational Staff</h3>
          <form className="staff-form" onSubmit={handleAddStaff}>
            <div className="form-input-group">
              <label>Employee Full Name</label>
              <input 
                type="text" 
                required
                value={newStaffName} 
                onChange={(e) => setNewStaffName(e.target.value)} 
                placeholder="e.g. Anand Sharma" 
                className="staff-field"
              />
            </div>
            <div className="form-input-group">
              <label>LendoGo Office Email</label>
              <input 
                type="email" 
                required
                value={newStaffEmail} 
                onChange={(e) => setNewStaffEmail(e.target.value)} 
                placeholder="e.g. anand.s@lendogo.com" 
                className="staff-field"
              />
            </div>
            <div className="form-input-group">
              <label>Assigned Staff Role</label>
              <select 
                value={newStaffRole} 
                onChange={(e) => setNewStaffRole(e.target.value)}
                className="staff-field"
              >
                <option value="Verification Agent">Verification Agent (L1 Ops)</option>
                <option value="Credit Underwriter">Credit Underwriter (L2 Compliance)</option>
              </select>
            </div>
            <button type="submit" className="btn-add-staff-submit">
              ＋ Save Staff Member
            </button>
          </form>
        </div>

        <div className="sub-panel flex-2">
          <h3>Current Active Team</h3>
          <table className="admin-data-table mini-table">
            <thead>
              <tr>
                <th>Staff Officer</th>
                <th>Assigned Role</th>
                <th>Clearance Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((staff, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="applicant-profile-cell">
                      <strong>{staff.name}</strong>
                      <span>{staff.email}</span>
                    </div>
                  </td>
                  <td>{staff.role}</td>
                  <td><code>{staff.clearance}</code></td>
                  <td>
                    <span className={`status-tag ${staff.status === 'Active' ? 'active' : 'suspended'}`}>
                      {staff.status}
                    </span>
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

export default StaffManagementTab;
