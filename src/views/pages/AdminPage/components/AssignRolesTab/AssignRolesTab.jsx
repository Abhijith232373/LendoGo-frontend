import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../../../utils/apiClient';
import "./AssignRolesTab.css";

const AVAILABLE_ROLES = [
  "Subadmin", 
  "HR", 
  "Verification Officer", 
  "Blog Manager", 
  "Customer Care Support"
];

const AVAILABLE_MODULES = [
  { id: 'Dashboard', permissions: [{ id: 'dashboard_view', label: 'View Dashboard' }] },
  { id: 'Loan Applications', permissions: [{ id: 'loan_app_view', label: 'View Applications' }, { id: 'loan_app_update', label: 'Update Applications' }] },
  { id: 'KYC Verifications', permissions: [{ id: 'kyc_view', label: 'View KYC' }, { id: 'kyc_update', label: 'Update KYC' }] },
  { id: 'User Management', permissions: [{ id: 'user_create', label: 'Create User' }, { id: 'user_read', label: 'Read User' }, { id: 'user_update', label: 'Update User' }, { id: 'user_delete', label: 'Delete User' }] },
  { id: 'Careers', permissions: [{ id: 'career_app_view', label: 'View Applications' }, { id: 'career_app_update', label: 'Update Applications' }, { id: 'career_job_create', label: 'Create Post' }, { id: 'career_job_update', label: 'Update Post' }] },
  { id: 'Customer Care', permissions: [{ id: 'cc_consult_view', label: 'View Consultation' }, { id: 'cc_chat_view', label: 'View Chat' }] },
  { id: 'Due Date', permissions: [{ id: 'due_view', label: 'View Due Date' }] },
  { id: 'Blog Management', permissions: [{ id: 'blog_create', label: 'Create Blog' }, { id: 'blog_read', label: 'Read Blog' }, { id: 'blog_update', label: 'Update Blog' }, { id: 'blog_delete', label: 'Delete Blog' }] }
];

const AssignRolesTab = () => {
  // Local state for staff to fully support CRUD in UI
  const [localStaff, setLocalStaff] = useState([]);

  useEffect(() => {
    fetchStaff();

    // Listen for WebSocket global updates
    const handleUpdate = () => fetchStaff();
    window.addEventListener('admin-staff-updated', handleUpdate);
    return () => window.removeEventListener('admin-staff-updated', handleUpdate);
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await apiClient('/admin/staff');
      const data = res?.data || res || [];
      const mappedStaff = data.map(staff => {
        const areas = [];
        if (staff.permissions) {
          Object.keys(staff.permissions).forEach(key => {
            if (staff.permissions[key]) areas.push(key);
          });
        }
        return {
          id: staff.id,
          name: staff.full_name,
          email: staff.email,
          role: staff.role,
          status: staff.status || 'Active',
          areas: areas
        };
      });
      setLocalStaff(mappedStaff);
    } catch (err) {
      console.error("Failed to fetch staff directory:", err);
    }
  };

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(AVAILABLE_ROLES[0]);
  const [selectedAreas, setSelectedAreas] = useState([]);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);

  const showToastNotification = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: '', // 'block', 'activate', 'delete'
    staffId: null,
    staffName: ''
  });

  const openModal = (type, staff) => {
    setModalConfig({ isOpen: true, type, staffId: staff.id, staffName: staff.name });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: '', staffId: null, staffName: '' });
  };

  const confirmAction = async () => {
    const { type, staffId, staffName } = modalConfig;
    
    try {
      if (type === 'delete') {
        await apiClient(`/admin/staff/${staffId}`, { method: 'DELETE' });
        setLocalStaff(prev => prev.filter(staff => staff.id !== staffId));
        showToastNotification(`Staff member ${staffName} deleted successfully.`);
      } else if (type === 'block' || type === 'activate') {
        const nextStatus = type === 'block' ? 'Blocked' : 'Active';
        await apiClient(`/admin/staff/${staffId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: nextStatus })
        });
        setLocalStaff(prev => prev.map(staff => 
          staff.id === staffId ? { ...staff, status: nextStatus } : staff
        ));
        showToastNotification(`Staff member ${staffName} ${type === 'block' ? 'blocked' : 'activated'} successfully.`, 'success');
      }
    } catch (err) {
      console.error(`Failed to ${type} staff:`, err);
      showToastNotification(`Error: ${err.message}`, 'error');
    }
    closeModal();
  };

  const toggleArea = (area) => {
    setSelectedAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !role) {
      showToastNotification("Name, Email, and Role are required.", "error");
      return;
    }

    const permissionsMap = {};
    AVAILABLE_MODULES.forEach(mod => {
      permissionsMap[mod.id] = selectedAreas.includes(mod.id);
    });

    if (isEditing) {
      // For now, editing works only locally since we only mapped POST and GET
      setLocalStaff(prev => prev.map(staff => 
        staff.id === editId 
          ? { ...staff, name, email, role, areas: selectedAreas, password: password || staff.password } 
          : staff
      ));
      setIsEditing(false);
      setEditId(null);
      showToastNotification("Staff updated successfully!", "success");
    } else {
      if (!password) {
        showToastNotification("Password is required for new accounts.", "error");
        return;
      }
      try {
        await apiClient('/admin/staff', {
          method: 'POST',
          body: JSON.stringify({
            full_name: name,
            email: email,
            password: password,
            role: role,
            permissions: permissionsMap
          })
        });
        showToastNotification("Staff created successfully!", "success");
        fetchStaff();
      } catch (err) {
        console.error("Failed to provision staff:", err);
        const errorMsg = err.message.includes("500") || err.message === "Internal Server Error" 
          ? "Failed: Email already exists or server error." 
          : `Failed: ${err.message}`;
        showToastNotification(errorMsg, "error");
        return;
      }
    }

    // Reset form
    setName('');
    setEmail('');
    setPassword('');
    setRole(AVAILABLE_ROLES[0]);
    setSelectedAreas([]);
  };

  const startEdit = (staff) => {
    setIsEditing(true);
    setEditId(staff.id);
    setName(staff.name);
    setEmail(staff.email);
    setPassword(''); // don't show existing password
    setRole(staff.role);
    setSelectedAreas(staff.areas || []);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole(AVAILABLE_ROLES[0]);
    setSelectedAreas([]);
  };



  const filteredStaff = localStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || staff.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || staff.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="tab-pane-container animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div className="section-header-row" style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--admin-text)' }}>Staff Management</h2>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Create/Update Form */}
        <div style={{ 
          flex: '1 1 350px', 
          backgroundColor: 'var(--admin-card)', 
          border: '1px solid var(--admin-border)', 
          borderRadius: '16px', 
          padding: '28px',
          boxShadow: '0 4px 20px var(--admin-shadow)',
          position: 'sticky',
          top: '20px'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '24px', color: 'var(--admin-text)' }}>
            {isEditing ? 'Update Employee Profile' : 'Provision New Employee'}
          </h3>
          
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
              <input 
                type="text" 
                required
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Anand Sharma" 
                style={{ backgroundColor: 'var(--admin-input)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '12px 14px', color: 'var(--admin-text)', outline: 'none', width: '100%' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
              <input 
                type="email" 
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="e.g. anand@lendogo.com" 
                style={{ backgroundColor: 'var(--admin-input)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '12px 14px', color: 'var(--admin-text)', outline: 'none', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isEditing ? 'New Password (Optional)' : 'Password'}
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required={!isEditing}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  style={{ backgroundColor: 'var(--admin-input)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '12px 14px', color: 'var(--admin-text)', outline: 'none', width: '100%', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-light)', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ backgroundColor: 'var(--admin-input)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '12px 14px', color: 'var(--admin-text)', outline: 'none', width: '100%', cursor: 'pointer' }}
              >
                {AVAILABLE_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px', backgroundColor: 'var(--admin-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-text)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Area Permissions</label>
              {AVAILABLE_MODULES.map(mod => (
                <div key={mod.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--admin-text)', fontWeight: 600 }}>{mod.id}</span>
                    <label className="toggle-switch" style={{ transform: 'scale(0.85)', margin: 0 }}>
                      <input type="checkbox" checked={selectedAreas.includes(mod.id)} onChange={() => toggleArea(mod.id)} />
                      <span className="slider-round" />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button 
                type="submit" 
                style={{ 
                  flex: 1,
                  padding: '14px', 
                  borderRadius: '10px', 
                  backgroundColor: 'var(--primary)', 
                  color: '#fff', 
                  fontWeight: 700, 
                  border: 'none', 
                  cursor: 'pointer',
                  transition: '0.2s',
                  boxShadow: '0 4px 10px rgba(0, 102, 255, 0.2)'
                }}
              >
                {isEditing ? '✓ Update Account' : '＋ Provision Account'}
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  onClick={cancelEdit}
                  style={{ 
                    padding: '14px 20px', 
                    borderRadius: '10px', 
                    backgroundColor: 'transparent', 
                    border: '1px solid var(--admin-border)',
                    color: 'var(--admin-text)', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    transition: '0.2s'
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Directory List */}
        <div style={{ 
          flex: '2 1 600px', 
          backgroundColor: 'var(--admin-card)', 
          border: '1px solid var(--admin-border)', 
          borderRadius: '16px', 
          padding: '28px',
          boxShadow: '0 4px 20px var(--admin-shadow)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '24px', color: 'var(--admin-text)' }}>Staff Directory</h3>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, minWidth: '200px', backgroundColor: 'var(--admin-input)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '10px 14px', color: 'var(--admin-text)', outline: 'none', fontSize: '0.9rem' }}
            />
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ width: 'auto', backgroundColor: 'var(--admin-input)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '10px 14px', color: 'var(--admin-text)', outline: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              <option value="All">All Roles</option>
              {AVAILABLE_ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto', backgroundColor: 'var(--admin-input)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '10px 14px', color: 'var(--admin-text)', outline: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div className="table-responsive-admin" style={{ border: 'none', boxShadow: 'none', borderRadius: '12px', overflow: 'hidden' }}>
            <table className="admin-data-table w-full text-left" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px', borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-light)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' }}>Employee</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-light)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' }}>Role & Areas</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-light)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-light)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '36px', height: '36px', 
                          borderRadius: '10px', 
                          backgroundColor: 'var(--admin-hover)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem'
                        }}>
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text)' }}>{staff.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)' }}>{staff.email}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '4px 8px', 
                          borderRadius: '6px', 
                          backgroundColor: 'rgba(0, 102, 255, 0.1)', 
                          color: 'var(--primary)', 
                          fontSize: '0.75rem', 
                          fontWeight: 700,
                          width: 'fit-content'
                        }}>
                          {staff.role}
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {staff.areas.map(a => (
                            <span key={a} style={{ fontSize: '0.7rem', color: 'var(--admin-text-light)', backgroundColor: 'var(--admin-bg)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--admin-border)' }}>
                              {a}
                            </span>
                          ))}
                          {staff.areas.length === 0 && <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-light)' }}>No areas assigned</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        backgroundColor: staff.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: staff.status === 'Active' ? '#10b981' : '#ef4444'
                      }}>
                        {staff.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => startEdit(staff)}
                          style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'var(--admin-hover)', color: 'var(--admin-text)', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => openModal(staff.status === 'Active' ? 'block' : 'activate', staff)}
                          style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: staff.status === 'Active' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: staff.status === 'Active' ? '#ef4444' : '#10b981', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                          {staff.status === 'Active' ? 'Block' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => openModal('delete', staff)}
                          style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStaff.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: 'var(--admin-text-light)' }}>
                      No staff members found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Professional Toast Notification */}
      {showToast && (
        <div className="staff-action-toast" style={{ backgroundColor: toastType === 'error' ? '#fef2f2' : '#f0fdf4', borderColor: toastType === 'error' ? '#fecaca' : '#bbf7d0' }}>
          <div className="toast-icon" style={{ color: toastType === 'error' ? '#ef4444' : '#16a34a', backgroundColor: toastType === 'error' ? '#fee2e2' : '#dcfce3' }}>
            {toastType === 'error' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            )}
          </div>
          <div className="toast-content">
            <span className="toast-title" style={{ color: toastType === 'error' ? '#991b1b' : '#166534' }}>{toastType === 'error' ? 'Error' : 'Success'}</span>
            <span className="toast-msg" style={{ color: toastType === 'error' ? '#b91c1c' : '#15803d' }}>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {modalConfig.isOpen && (
        <div className="staff-modal-overlay">
          <div className="staff-modal-content animate-scale-up">
            <div className="modal-icon-wrapper theme-icon">
              {modalConfig.type === 'delete' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              ) : modalConfig.type === 'block' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              )}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--admin-text)', marginBottom: '10px' }}>
              Confirm {modalConfig.type === 'delete' ? 'Deletion' : modalConfig.type === 'block' ? 'Block' : 'Activation'}
            </h3>
            <p style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
              Are you sure you want to {modalConfig.type} <strong>{modalConfig.staffName}</strong>? 
              {modalConfig.type === 'delete' ? ' This action cannot be undone and will permanently remove their access.' : modalConfig.type === 'block' ? ' They will be instantly signed out.' : ' They will regain access.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button 
                onClick={closeModal}
                className="btn-modal-cancel"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              >
                Yes, {modalConfig.type}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRolesTab;
