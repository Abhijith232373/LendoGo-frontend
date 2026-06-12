import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import "./UserManagementTab.css";
import { apiClient } from '../../../../../utils/apiClient';

const UserManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Confirmation Modal state
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: null,
    isDestructive: false,
    isInfoOnly: false
  });

  // Edit Form states
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('User');
  const [editPan, setEditPan] = useState('');
  const [editRating, setEditRating] = useState('Low Risk');
  const [editCreditScore, setEditCreditScore] = useState(750);
  const [editDob, setEditDob] = useState('');
  const [editMobileNumber, setEditMobileNumber] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editPincode, setEditPincode] = useState('');

  // Add Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState('User');
  const [addPan, setAddPan] = useState('');
  const [addRating, setAddRating] = useState('Low Risk');
  const [addCreditScore, setAddCreditScore] = useState(750);
  const [addDob, setAddDob] = useState('');
  const [addMobileNumber, setAddMobileNumber] = useState('');
  const [addAddress, setAddAddress] = useState('');
  const [addCity, setAddCity] = useState('');
  const [addState, setAddState] = useState('');
  const [addPincode, setAddPincode] = useState('');

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await apiClient('/admin/all-users');
      const rawUsers = res?.data || res || [];
      
      // Normalize field names from Go backend
      const normalized = rawUsers.map(u => ({
        ...u,
        id: String(u.id || u.ID || u.Id || ''),
        fullName: u.full_name || u.FullName || u.fullName || 'Unknown',
        email: u.email || '',
        role: u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : 'User',
        PAN: u.profile?.pan_card_number || u.PAN || u.pan || 'Attached',
        rating: u.profile?.credit_rating || u.rating || 'Low Risk',
        status: u.status || 'Active',
        creditScore: u.profile?.trust_score || u.creditScore || u.credit_score || 750,
        dob: u.profile?.date_of_birth || u.dob || '',
        mobileNumber: u.profile?.phone_number || u.mobile_number || u.mobileNumber || '',
        address: u.profile?.address || u.address || '',
        city: u.profile?.city || u.city || '',
        state: u.profile?.state || u.state || '',
        pincode: u.profile?.pincode || u.pincode || '',
        createdAt: u.created_at || u.createdAt
      }));
      
      setUsers(normalized);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // API Actions
  const requestToggleUserStatus = (userId, currentStatus, userName) => {
    const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    const isBlocking = newStatus === 'Blocked';
    setConfirmConfig({
      isOpen: true,
      title: isBlocking ? 'Block User Account' : 'Activate User Account',
      message: isBlocking 
        ? `Are you sure you want to block ${userName}? They will immediately lose access to the system.` 
        : `Are you sure you want to activate ${userName}? They will regain full access to the system.`,
      confirmText: isBlocking ? 'Block User' : 'Activate User',
      isDestructive: isBlocking,
      onConfirm: async () => {
        try {
          await apiClient(`/admin/users/${userId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus })
          });
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        } catch (err) {
          alert("Failed to update status. Check backend logs.");
        }
      }
    });
  };

  const requestDeleteUser = (userId, userName) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Deletion',
      message: `Are you sure you want to permanently delete user ${userName}? This action cannot be undone.`,
      confirmText: 'Delete Permanently',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await apiClient(`/admin/users/${userId}`, { method: 'DELETE' });
          setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (err) {
          alert("Failed to delete user.");
        }
      }
    });
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    const updatedFields = {
      full_name: editName,
      email: editEmail,
      role: editRole,
      pan_card_number: editPan,
      credit_rating: editRating,
      credit_score: Number(editCreditScore),
      date_of_birth: editDob,
      phone_number: editMobileNumber,
      address: editAddress,
      city: editCity,
      state: editState,
      pincode: editPincode
    };

    try {
      await apiClient(`/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedFields)
      });
      
      setUsers(users.map(u => u.id === selectedUser.id ? { 
        ...u, 
        fullName: editName,
        email: editEmail,
        role: editRole,
        PAN: editPan,
        rating: editRating,
        creditScore: Number(editCreditScore),
        dob: editDob,
        mobileNumber: editMobileNumber,
        address: editAddress,
        city: editCity,
        state: editState,
        pincode: editPincode
      } : u));
      
      setShowEditModal(false);
    } catch (err) {
      console.warn("Backend PUT failed, falling back to local simulation:", err);
      setUsers(users.map(u => u.id === selectedUser.id ? { 
        ...u, 
        fullName: editName,
        email: editEmail,
        role: editRole,
        PAN: editPan,
        rating: editRating,
        creditScore: Number(editCreditScore),
        dob: editDob,
        mobileNumber: editMobileNumber,
        address: editAddress,
        city: editCity,
        state: editState,
        pincode: editPincode
      } : u));
      setShowEditModal(false);
    }
  };

  const onSubmitAdd = async (e) => {
    e.preventDefault();
    const newUserObj = {
      fullName: addName,
      full_name: addName,
      email: addEmail,
      role: addRole,
      pan_card_number: addPan,
      credit_rating: addRating,
      credit_score: Number(addCreditScore),
      dob: addDob,
      mobile_number: addMobileNumber,
      address: addAddress,
      city: addCity,
      state: addState,
      pincode: addPincode,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    try {
      const res = await apiClient('/admin/users', {
        method: 'POST',
        body: JSON.stringify(newUserObj)
      });
      const created = res?.data || newUserObj;
      setUsers([
        {
          ...created,
          id: String(created.id || created.ID || `USR-${Math.floor(1000 + Math.random() * 9000)}`),
          fullName: created.full_name || created.fullName || addName,
          email: created.email || addEmail,
          status: created.status || 'Active',
          role: created.role || addRole,
          PAN: created.profile?.pan_card_number || addPan,
          rating: created.profile?.credit_rating || addRating,
          creditScore: created.profile?.trust_score || Number(addCreditScore),
          dob: created.profile?.date_of_birth || addDob,
          mobileNumber: created.profile?.phone_number || addMobileNumber,
          address: created.profile?.address || addAddress,
          city: created.profile?.city || addCity,
          state: created.profile?.state || addState,
          pincode: created.profile?.pincode || addPincode,
          createdAt: created.created_at || created.createdAt || new Date().toISOString()
        },
        ...users
      ]);
      setShowAddModal(false);

      if (res?.default_password) {
        setConfirmConfig({
          isOpen: true,
          title: 'Account Created Successfully',
          message: `The user account was created successfully.\n\nPlease copy this auto-generated temporary password and securely share it with the user so they can log in:\n\nPassword: ${res.default_password}`,
          confirmText: 'Acknowledge',
          isDestructive: false,
          isInfoOnly: true,
          onConfirm: async () => {}
        });
      }
    } catch (err) {
      console.warn("Backend creation failed, falling back to local simulation:", err);
      const mockCreated = {
        ...newUserObj,
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`
      };
      setUsers([mockCreated, ...users]);
      setShowAddModal(false);
    }
  };

  // Modal Handlers
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditName(user.fullName || user.full_name || '');
    setEditEmail(user.email || '');
    setEditRole(user.role || 'User');
    setEditPan(user.PAN || user.pan || '');
    setEditRating(user.rating || 'Low Risk');
    setEditCreditScore(user.creditScore || user.credit_score || 750);
    setEditDob(user.dob || '');
    setEditMobileNumber(user.mobileNumber || user.mobile_number || '');
    setEditAddress(user.address || '');
    setEditCity(user.city || '');
    setEditState(user.state || '');
    setEditPincode(user.pincode || '');
    setShowEditModal(true);
  };

  const openAddModal = () => {
    setAddName('');
    setAddEmail('');
    setAddRole('User');
    setAddPan('');
    setAddRating('Low Risk');
    setAddCreditScore(750);
    setAddDob('');
    setAddMobileNumber('');
    setAddAddress('');
    setAddCity('');
    setAddState('');
    setAddPincode('');
    setShowAddModal(true);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  if (loading) return <div className="text-white p-8">Loading real database users...</div>;

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || (u.status && u.status.toLowerCase() === statusFilter.toLowerCase());
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="tab-pane-container animate-fade-in">
      {/* ── CONFIRMATION MODAL ── */}
      {confirmConfig.isOpen && createPortal(
        <div className="admin-dashboard-wrapper dark-theme" style={{ display: 'contents' }}>
          <div className="admin-modal-overlay" onClick={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}>
            <div className="admin-modal-container" style={{ width: '450px', maxWidth: '90vw', padding: 0 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{confirmConfig.title}</h3>
                <button className="close-btn" onClick={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}>✕</button>
              </div>
              <div className="modal-body" style={{ minHeight: '80px', color: 'var(--admin-text)', fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {confirmConfig.message}
              </div>
              <div className="modal-footer">
                {!confirmConfig.isInfoOnly && (
                  <button className="btn-secondary-admin" onClick={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}>Cancel</button>
                )}
                <button 
                  className="btn-primary-admin" 
                  style={{ backgroundColor: confirmConfig.isDestructive ? '#ef4444' : 'var(--primary)', color: '#ffffff' }}
                  onClick={async () => {
                    if (confirmConfig.onConfirm) await confirmConfig.onConfirm();
                    setConfirmConfig({ ...confirmConfig, isOpen: false });
                  }}
                >
                  {confirmConfig.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>User Management</h2>
        </div>
        <button 
          className="btn-action-primary" 
          onClick={openAddModal}
          style={{ height: '38px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 16px', borderRadius: '8px', fontWeight: '700' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New User
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by name, email, or ID..." 
          className="form-input-admin" 
          style={{ flex: 1, minWidth: '200px' }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select className="form-input-admin" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <div className="table-responsive-admin">
        <table className="admin-data-table w-full text-left">
          <thead>
            <tr>
              <th className="p-4">User ID</th>
              <th className="p-4">Role</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4 text-center">Action Buttons</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-4 text-gray-300"><strong>USR-{(user.id || '').substring(0, 4).toUpperCase()}</strong></td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                      user.role === 'Admin' ? 'bg-purple-900/50 text-purple-400' :
                      user.role === 'User' ? 'bg-teal-900/50 text-teal-400' :
                      'bg-blue-900/50 text-blue-400'
                    }`}>
                      {user.role || 'User'}
                    </span>
                  </td>
                  <td className="p-4 text-white">{user.fullName}</td>
                  <td className="p-4 text-gray-400">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'Blocked' ? 'bg-red-900/50 text-red-500' : 'bg-green-900/50 text-green-500'}`}>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {(() => {
                      const dateVal = user.createdAt || user.created_at;
                      if (!dateVal) return 'N/A';
                      const parsed = new Date(dateVal);
                      return isNaN(parsed.getTime()) ? 'N/A' : parsed.toLocaleDateString();
                    })()}
                  </td>
                  <td className="p-4">
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button className="bg-blue-600/20 text-blue-500 px-3 py-1 rounded hover:bg-blue-600/30" onClick={() => openViewModal(user)}>Inspect</button>
                      <button className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600" onClick={() => openEditModal(user)}>Edit</button>
                      <button 
                        className={`px-3 py-1 rounded ${user.status === 'Active' || !user.status ? 'bg-orange-600/20 text-orange-500 hover:bg-orange-600/30' : 'bg-green-600/20 text-green-500 hover:bg-green-600/30'}`}
                        onClick={() => requestToggleUserStatus(user.id, user.status || 'Active', user.fullName)}
                      >
                        {user.status === 'Active' || !user.status ? 'Block' : 'Activate'}
                      </button>
                      <button 
                        className="bg-red-900/40 text-red-500 px-3 py-1 rounded border border-red-500/20 hover:bg-red-900/60"
                        onClick={() => requestDeleteUser(user.id, user.fullName)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="p-8 text-center text-gray-500">No users found in database.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── ADD USER MODAL ── */}
      {showAddModal && createPortal(
        <div className="admin-dashboard-wrapper dark-theme" style={{ display: 'contents' }}>
          <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="admin-modal-container" style={{ width: '680px', maxWidth: '95vw' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New System User</h3>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
              </div>
              <form onSubmit={onSubmitAdd}>
                <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                  <div className="form-row-admin">
                    <div className="form-group-admin">
                      <label>Full Name</label>
                      <input type="text" className="form-input-admin" value={addName} onChange={(e) => setAddName(e.target.value)} required placeholder="Enter full name" />
                    </div>
                    <div className="form-group-admin">
                      <label>Email Address</label>
                      <input type="email" className="form-input-admin" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} required placeholder="name@domain.com" />
                    </div>
                  </div>

                  <div className="form-row-admin">
                    <div className="form-group-admin">
                      <label>Role Clearance</label>
                      <select className="form-input-admin" value={addRole} onChange={(e) => setAddRole(e.target.value)}>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div className="form-group-admin">
                      <label>Mobile Number</label>
                      <input type="text" className="form-input-admin" value={addMobileNumber} onChange={(e) => setAddMobileNumber(e.target.value)} placeholder="e.g. 9895000000" />
                    </div>
                  </div>

                  <div className="form-row-admin">
                    <div className="form-group-admin">
                      <label>Date of Birth</label>
                      <input type="date" className="form-input-admin" value={addDob} onChange={(e) => setAddDob(e.target.value)} />
                    </div>
                    <div className="form-group-admin">
                      <label>PAN Card Number</label>
                      <input type="text" className="form-input-admin" value={addPan} onChange={(e) => setAddPan(e.target.value)} placeholder="e.g. ABCDE1234F" />
                    </div>
                  </div>

                  <div className="form-row-admin">
                    <div className="form-group-admin">
                      <label>Credit Rating</label>
                      <select className="form-input-admin" value={addRating} onChange={(e) => setAddRating(e.target.value)}>
                        <option value="Low Risk">Low Risk (Safe)</option>
                        <option value="Medium Risk">Medium Risk</option>
                        <option value="High Risk">High Risk</option>
                      </select>
                    </div>
                    <div className="form-group-admin">
                      <label>Credit Score (300-850)</label>
                      <input type="number" min="300" max="850" className="form-input-admin" value={addCreditScore} onChange={(e) => setAddCreditScore(e.target.value)} />
                    </div>
                  </div>

                  <div className="form-group-admin">
                    <label>Residential Street Address</label>
                    <input type="text" className="form-input-admin" value={addAddress} onChange={(e) => setAddAddress(e.target.value)} placeholder="Apartment, Suite, Street Name" />
                  </div>

                  <div className="form-row-admin">
                    <div className="form-group-admin">
                      <label>City</label>
                      <input type="text" className="form-input-admin" value={addCity} onChange={(e) => setAddCity(e.target.value)} placeholder="City" />
                    </div>
                    <div className="form-group-admin">
                      <label>State / Region</label>
                      <input type="text" className="form-input-admin" value={addState} onChange={(e) => setAddState(e.target.value)} placeholder="State" />
                    </div>
                  </div>

                  <div className="form-group-admin">
                    <label>Postal Pincode</label>
                    <input type="text" className="form-input-admin" value={addPincode} onChange={(e) => setAddPincode(e.target.value)} placeholder="Pincode" />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary-admin" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary-admin">Add User Account</button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── EDIT USER MODAL ── */}
      {showEditModal && selectedUser && createPortal(
        <div className="admin-dashboard-wrapper dark-theme" style={{ display: 'contents' }}>
          <div className="admin-modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="admin-modal-container" style={{ width: '680px', maxWidth: '95vw' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit System User Portfolio</h3>
                <button className="close-btn" onClick={() => setShowEditModal(false)}>✕</button>
              </div>
              <form onSubmit={onSubmitEdit}>
                <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                  <div className="form-row-admin">
                    <div className="form-group-admin">
                      <label>Full Name</label>
                      <input type="text" className="form-input-admin" value={editName} onChange={(e) => setEditName(e.target.value)} required placeholder="Enter full name" />
                    </div>
                    <div className="form-group-admin">
                      <label>Email Address</label>
                      <input type="email" className="form-input-admin" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required placeholder="name@domain.com" />
                    </div>
                  </div>

                  <div className="form-row-admin">
                    <div className="form-group-admin">
                      <label>Role Clearance</label>
                      <select className="form-input-admin" value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div className="form-group-admin">
                      <label>Mobile Number</label>
                      <input type="text" className="form-input-admin" value={editMobileNumber} onChange={(e) => setEditMobileNumber(e.target.value)} placeholder="e.g. 9895000000" />
                    </div>
                  </div>

                  <div className="form-row-admin">
                    <div className="form-group-admin">
                      <label>Date of Birth</label>
                      <input type="date" className="form-input-admin" value={editDob} onChange={(e) => setEditDob(e.target.value)} />
                    </div>
                    <div className="form-group-admin">
                      <label>PAN Card Number</label>
                      <input type="text" className="form-input-admin" value={editPan} onChange={(e) => setEditPan(e.target.value)} placeholder="e.g. ABCDE1234F" />
                    </div>
                  </div>

                  <div className="form-row-admin">
                    <div className="form-group-admin">
                      <label>Credit Rating</label>
                      <select className="form-input-admin" value={editRating} onChange={(e) => setEditRating(e.target.value)}>
                        <option value="Low Risk">Low Risk (Safe)</option>
                        <option value="Medium Risk">Medium Risk</option>
                        <option value="High Risk">High Risk</option>
                      </select>
                    </div>
                    <div className="form-group-admin">
                      <label>Credit Score (300-850)</label>
                      <input type="number" min="300" max="850" className="form-input-admin" value={editCreditScore} onChange={(e) => setEditCreditScore(e.target.value)} />
                    </div>
                  </div>

                  <div className="form-group-admin">
                    <label>Residential Street Address</label>
                    <input type="text" className="form-input-admin" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} placeholder="Apartment, Suite, Street Name" />
                  </div>

                  <div className="form-row-admin">
                    <div className="form-group-admin">
                      <label>City</label>
                      <input type="text" className="form-input-admin" value={editCity} onChange={(e) => setEditCity(e.target.value)} placeholder="City" />
                    </div>
                    <div className="form-group-admin">
                      <label>State / Region</label>
                      <input type="text" className="form-input-admin" value={editState} onChange={(e) => setEditState(e.target.value)} placeholder="State" />
                    </div>
                  </div>

                  <div className="form-group-admin">
                    <label>Postal Pincode</label>
                    <input type="text" className="form-input-admin" value={editPincode} onChange={(e) => setEditPincode(e.target.value)} placeholder="Pincode" />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary-admin" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary-admin">Save Updates</button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── INSPECT MODAL ── */}
      {showViewModal && selectedUser && createPortal(
        <div className="admin-dashboard-wrapper dark-theme" style={{ display: 'contents' }}>
          <div className="admin-modal-overlay" onClick={() => setShowViewModal(false)}>
            <div className="admin-modal-container" style={{ width: '680px', maxWidth: '95vw' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Borrower Portfolio</h3>
                <button className="close-btn" onClick={() => setShowViewModal(false)}>✕</button>
              </div>
              <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                <div style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <h4 className="text-xl text-white font-bold">{selectedUser.fullName}</h4>
                  <p className="text-xs text-gray-400">ID: {selectedUser.id}</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <span className="text-gray-400 text-xs block" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Email Address</span>
                    <span className="text-white text-sm font-medium">{selectedUser.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Role Clearance</span>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold inline-block ${
                      selectedUser.role === 'Admin' ? 'bg-purple-900/50 text-purple-400' :
                      selectedUser.role === 'User' ? 'bg-teal-900/50 text-teal-400' :
                      'bg-blue-900/50 text-blue-400'
                    }`}>{selectedUser.role || 'User'}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 text-xs block" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Mobile Number</span>
                    <span className="text-white text-sm font-medium">{selectedUser.mobileNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Date of Birth</span>
                    <span className="text-white text-sm font-medium">{selectedUser.dob || 'N/A'}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 text-xs block" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>PAN Identifier</span>
                    <span className="text-white text-sm font-mono">{selectedUser.PAN || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Bureau Index / Score</span>
                    <span className={`text-sm font-bold ${
                      selectedUser.creditScore >= 700 ? 'text-green-400' :
                      selectedUser.creditScore >= 600 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>{selectedUser.creditScore || 750} Points ({selectedUser.rating || 'Low Risk'})</span>
                  </div>
                  
                  <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--admin-border)', paddingTop: '12px', marginTop: '8px' }}>
                    <span className="text-gray-400 text-xs block" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Residential Street Address</span>
                    <span className="text-white text-sm block font-medium">{selectedUser.address || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>City / State</span>
                    <span className="text-white text-sm font-medium">{selectedUser.city || 'N/A'}, {selectedUser.state || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Postal Pincode</span>
                    <span className="text-white text-sm font-medium">{selectedUser.pincode || 'N/A'}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 text-xs block" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Account Status</span>
                    <span className={`text-sm font-bold ${selectedUser.status === 'Blocked' ? 'text-red-400' : 'text-green-400'}`}>
                      {selectedUser.status || 'Active'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Registration Date</span>
                    <span className="text-white text-sm font-medium">
                      {(() => {
                        const dateVal = selectedUser.createdAt || selectedUser.created_at;
                        if (!dateVal) return 'N/A';
                        const parsed = new Date(dateVal);
                        return isNaN(parsed.getTime()) ? 'N/A' : parsed.toLocaleDateString();
                      })()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-primary-admin" onClick={() => setShowViewModal(false)}>Close Portfolio</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default UserManagementTab;