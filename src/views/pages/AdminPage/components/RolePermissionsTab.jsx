import React, { useState } from 'react';

const RolePermissionsTab = () => {
  const [permissions, setPermissions] = useState({
    'Super Admin': ['loans_approve', 'loans_reject', 'kyc_verify', 'users_manage', 'web_config', 'audit_logs'],
    'Lending Officer': ['loans_approve', 'loans_reject', 'kyc_verify', 'audit_logs'],
    'Underwriter': ['kyc_verify', 'audit_logs'],
    'Verification Agent': ['kyc_verify']
  });

  const [isSaved, setIsSaved] = useState(false);

  const permissionList = [
    { id: 'loans_approve', label: 'Approve & Sanction Loans', desc: 'Ability to disburse capital to approved borrow ledgers.' },
    { id: 'loans_reject', label: 'Reject Applications', desc: 'Allows declining incoming loan sanction requests.' },
    { id: 'kyc_verify', label: 'Verify KYC Documents', desc: 'Inspect selfies, ID cards, and statements to approve user KYC.' },
    { id: 'users_manage', label: 'Manage User Accounts', desc: 'Suspend or activate borrow directory profiles.' },
    { id: 'web_config', label: 'Edit System Settings', desc: 'Modify credit limits, base rates, and platform setups.' },
    { id: 'audit_logs', label: 'View System Audit Logs', desc: 'Review administrative activity ledgers and risk logs.' }
  ];

  const roles = ['Super Admin', 'Lending Officer', 'Underwriter', 'Verification Agent'];

  const handleToggle = (role, permId) => {
    setPermissions(prev => {
      const currentPerms = prev[role];
      const nextPerms = currentPerms.includes(permId)
        ? currentPerms.filter(p => p !== permId)
        : [...currentPerms, permId];
      return { ...prev, [role]: nextPerms };
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
        <div>
          <h2>Role Permissions Matrix</h2>
          <p>Configure fine-grained system access controls, features visibility, and action clearances across LendoGo teams.</p>
        </div>

        <button 
          className="btn-action-primary" 
          onClick={handleSave}
          style={{ height: '42px', padding: '0 24px' }}
        >
          {isSaved ? '✓ Settings Saved' : '💾 Save Clearance Matrix'}
        </button>
      </div>

      {isSaved && (
        <div className="audit-state-box completed animate-pulse" style={{ padding: '14px 20px', borderRadius: '12px', border: '1px solid #10b981', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <span style={{ fontSize: '1.2rem', color: '#10b981' }}>✓</span>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e5e7eb' }}>Clearence updates saved. All staff permissions synced successfully with security sentinel.</span>
        </div>
      )}

      <div className="table-responsive-admin" style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--admin-card-border)', boxShadow: '0 10px 30px var(--admin-shadow)' }}>
        <table className="admin-data-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ width: '35%' }}>Permission Modules</th>
              {roles.map(role => (
                <th key={role} style={{ textAlign: 'center', width: '16.25%' }}>{role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionList.map((perm) => (
              <tr key={perm.id}>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text)' }}>{perm.label}</strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-light)', fontWeight: 500 }}>{perm.desc}</span>
                  </div>
                </td>
                {roles.map((role) => {
                  const isChecked = permissions[role].includes(perm.id);
                  const isSuperAdmin = role === 'Super Admin';
                  return (
                    <td key={role} style={{ textAlign: 'center' }}>
                      <label className="toggle-switch" style={{ margin: '0 auto', opacity: isSuperAdmin ? 0.7 : 1 }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isSuperAdmin} // Super Admin always has full access
                          onChange={() => handleToggle(role, perm.id)}
                        />
                        <span className="slider-round" />
                      </label>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolePermissionsTab;
