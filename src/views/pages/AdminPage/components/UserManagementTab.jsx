import React, { useState } from 'react';

const UserManagementTab = ({ 
  filteredUsers, 
  handleToggleUserStatus, 
  handleCreateUser, 
  handleUpdateUser, 
  handleDeleteUser 
}) => {
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  
  // Selected user for Edit/View operations
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states for Creation
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPAN, setCreatePAN] = useState('');
  const [createRating, setCreateRating] = useState('Low Risk');
  const [createStatus, setCreateStatus] = useState('Active');
  const [createCreditScore, setCreateCreditScore] = useState(700);
  const [createLoanHistory, setCreateLoanHistory] = useState('None');
  const [createJoined, setCreateJoined] = useState(new Date().toISOString().split('T')[0]);

  // Form states for Editing
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPAN, setEditPAN] = useState('');
  const [editRating, setEditRating] = useState('Low Risk');
  const [editStatus, setEditStatus] = useState('Active');
  const [editCreditScore, setEditCreditScore] = useState(700);
  const [editLoanHistory, setEditLoanHistory] = useState('');
  const [editJoined, setEditJoined] = useState('');

  // Mock document mapping
  const getDocUrl = (docKey) => {
    const mockDocs = {
      liveSelfie: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80',
      aadhaarFront: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
      aadhaarBack: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80',
      panCard: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=600&q=80',
      incomeProof: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    };
    return mockDocs[docKey];
  };

  const kycDocs = [
    { key: 'liveSelfie', label: 'Live Selfie (Photo)', type: 'image' },
    { key: 'aadhaarFront', label: 'Aadhaar Front (ID)', type: 'image' },
    { key: 'aadhaarBack', label: 'Aadhaar Back (ID)', type: 'image' },
    { key: 'panCard', label: 'PAN Card (ID)', type: 'image' },
    { key: 'incomeProof', label: '3-Month Bank Statement', type: 'pdf' }
  ];

  // Icons
  const CloseXIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  // Handle opening Edit Modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPAN(user.PAN || '');
    setEditRating(user.rating || 'Low Risk');
    setEditStatus(user.status || 'Active');
    setEditCreditScore(user.creditScore || 700);
    setEditLoanHistory(user.loanHistory || 'None');
    setEditJoined(user.joined || '');
    setShowEditModal(true);
  };

  // Handle opening View Modal
  const openViewModal = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Submit Create form
  const onSubmitCreate = (e) => {
    e.preventDefault();
    if (!createName || !createEmail) return;

    // Generate a random User ID
    const randomId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = {
      id: randomId,
      name: createName,
      email: createEmail,
      PAN: createPAN || 'APM***' + Math.floor(10 + Math.random() * 90) + 'P',
      rating: createRating,
      status: createStatus,
      creditScore: parseInt(createCreditScore) || 700,
      loanHistory: createLoanHistory,
      joined: createJoined
    };

    handleCreateUser(newUser);
    
    // Reset state
    setCreateName('');
    setCreateEmail('');
    setCreatePAN('');
    setCreateRating('Low Risk');
    setCreateStatus('Active');
    setCreateCreditScore(700);
    setCreateLoanHistory('None');
    setCreateJoined(new Date().toISOString().split('T')[0]);
    setShowCreateModal(false);
  };

  // Submit Edit form
  const onSubmitEdit = (e) => {
    e.preventDefault();
    if (!selectedUser || !editName || !editEmail) return;

    const updatedUser = {
      ...selectedUser,
      name: editName,
      email: editEmail,
      PAN: editPAN,
      rating: editRating,
      status: editStatus,
      creditScore: parseInt(editCreditScore) || 700,
      loanHistory: editLoanHistory,
      joined: editJoined
    };

    handleUpdateUser(updatedUser);
    setShowEditModal(false);
  };

  // Confirm delete user
  const confirmDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you absolutely sure you want to permanently delete user ${userName} (${userId})?`)) {
      handleDeleteUser(userId, userName);
    }
  };

  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Borrower Directory</h2>
          <p>Create, inspect, update clearances, or block user accounts in real-time.</p>
        </div>
        <button className="btn-action-primary" onClick={() => setShowCreateModal(true)}>
          Create New User
        </button>
      </div>

      <div className="table-responsive-admin">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Credit Score</th>
              <th>Loan History</th>
              <th>Joined Date</th>
              <th style={{ textAlign: 'center' }}>Action Buttons</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.id}</strong></td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-tag ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <span className={`score-badge ${user.creditScore >= 750 ? 'excellent' : user.creditScore >= 680 ? 'good' : 'poor'}`}>
                      {user.creditScore}
                    </span>
                  </td>
                  <td>
                    <span className="history-text" title={user.loanHistory}>
                      {user.loanHistory}
                    </span>
                  </td>
                  <td>{user.joined}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        className="btn-action-icon view"
                        onClick={() => openViewModal(user)}
                        title="See Details"
                      >
                        Inspect
                      </button>
                      <button 
                        className="btn-action-icon edit"
                        onClick={() => openEditModal(user)}
                        title="Update User"
                      >
                        Edit
                      </button>
                      <button 
                        className={`btn-action-status ${user.status === 'Active' ? 'suspend' : 'activate'}`}
                        onClick={() => handleToggleUserStatus(user.id, user.name, user.status)}
                        title={user.status === 'Active' ? 'Block User' : 'Activate User'}
                      >
                        {user.status === 'Active' ? 'Block' : 'Activate'}
                      </button>
                      <button 
                        className="btn-action-icon delete"
                        onClick={() => confirmDeleteUser(user.id, user.name)}
                        title="Delete User"
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-row-text">No registered users match your search queries.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── CREATE USER MODAL ── */}
      {showCreateModal && (
        <div className="admin-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Provision New Borrower Profile</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={onSubmitCreate}>
              <div className="modal-body">
                <div className="form-group-admin">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="form-input-admin" 
                    placeholder="Enter full name"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group-admin">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="form-input-admin" 
                    placeholder="name@email.com"
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-row-admin">
                  <div className="form-group-admin">
                    <label>Credit Score</label>
                    <input 
                      type="number" 
                      min="300" 
                      max="900" 
                      className="form-input-admin" 
                      value={createCreditScore}
                      onChange={(e) => setCreateCreditScore(e.target.value)}
                    />
                  </div>
                  <div className="form-group-admin">
                    <label>Risk Index Rating</label>
                    <select 
                      className="form-input-admin"
                      value={createRating}
                      onChange={(e) => setCreateRating(e.target.value)}
                    >
                      <option value="Low Risk">Low Risk</option>
                      <option value="Medium Risk">Medium Risk</option>
                      <option value="High Risk">High Risk</option>
                    </select>
                  </div>
                </div>
                <div className="form-group-admin">
                  <label>PAN Number (Optional)</label>
                  <input 
                    type="text" 
                    className="form-input-admin" 
                    placeholder="E.g. APM***32P"
                    value={createPAN}
                    onChange={(e) => setCreatePAN(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="form-group-admin">
                  <label>Loan History / Notes</label>
                  <input 
                    type="text" 
                    className="form-input-admin" 
                    placeholder="E.g. 2 Active Loans"
                    value={createLoanHistory}
                    onChange={(e) => setCreateLoanHistory(e.target.value)}
                  />
                </div>
                <div className="form-row-admin">
                  <div className="form-group-admin">
                    <label>Status Clearance</label>
                    <select 
                      className="form-input-admin"
                      value={createStatus}
                      onChange={(e) => setCreateStatus(e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                  <div className="form-group-admin">
                    <label>Joined Date</label>
                    <input 
                      type="date" 
                      className="form-input-admin" 
                      value={createJoined}
                      onChange={(e) => setCreateJoined(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary-admin" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-admin">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT USER MODAL ── */}
      {showEditModal && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Borrower Details ({selectedUser.id})</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={onSubmitEdit}>
              <div className="modal-body">
                <div className="form-group-admin">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="form-input-admin" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group-admin">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="form-input-admin" 
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-row-admin">
                  <div className="form-group-admin">
                    <label>Credit Score</label>
                    <input 
                      type="number" 
                      min="300" 
                      max="900" 
                      className="form-input-admin" 
                      value={editCreditScore}
                      onChange={(e) => setEditCreditScore(e.target.value)}
                    />
                  </div>
                  <div className="form-group-admin">
                    <label>Risk Index Rating</label>
                    <select 
                      className="form-input-admin"
                      value={editRating}
                      onChange={(e) => setEditRating(e.target.value)}
                    >
                      <option value="Low Risk">Low Risk</option>
                      <option value="Medium Risk">Medium Risk</option>
                      <option value="High Risk">High Risk</option>
                    </select>
                  </div>
                </div>
                <div className="form-group-admin">
                  <label>PAN Number</label>
                  <input 
                    type="text" 
                    className="form-input-admin" 
                    value={editPAN}
                    onChange={(e) => setEditPAN(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="form-group-admin">
                  <label>Loan History / Notes</label>
                  <input 
                    type="text" 
                    className="form-input-admin" 
                    value={editLoanHistory}
                    onChange={(e) => setEditLoanHistory(e.target.value)}
                  />
                </div>
                <div className="form-row-admin">
                  <div className="form-group-admin">
                    <label>Status Clearance</label>
                    <select 
                      className="form-input-admin"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                  <div className="form-group-admin">
                    <label>Joined Date</label>
                    <input 
                      type="date" 
                      className="form-input-admin" 
                      value={editJoined}
                      onChange={(e) => setEditJoined(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary-admin" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-admin">Save Updates</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── INSPECT / VIEW USER DETAILS MODAL ── */}
      {showViewModal && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="admin-modal-container inspection-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Borrower Inspection Portfolio</h3>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>×</button>
            </div>
            
            {/* Scroll-free Two-Column Grid Body */}
            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', padding: '24px' }}>
              
              {/* Left Column: Profile details + Loan history */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="inspection-profile-summary" style={{ marginBottom: '0', paddingBottom: '12px' }}>
                  <div className="avatar-circle-large">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedUser.name}</h4>
                    <span className="user-id-sub">{selectedUser.id}</span>
                  </div>
                </div>

                <div className="inspection-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="detail-card">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value" style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{selectedUser.email}</span>
                  </div>
                  <div className="detail-card">
                    <span className="detail-label">Credit Score</span>
                    <span className={`detail-value score-text ${selectedUser.creditScore >= 750 ? 'excellent' : selectedUser.creditScore >= 680 ? 'good' : 'poor'}`}>
                      {selectedUser.creditScore} Points
                    </span>
                  </div>
                  <div className="detail-card">
                    <span className="detail-label">PAN Identifier</span>
                    <span className="detail-value text-mono" style={{ fontSize: '0.85rem' }}>{selectedUser.PAN}</span>
                  </div>
                  <div className="detail-card">
                    <span className="detail-label">Compliance Clearance</span>
                    <span className={`detail-value status-text ${selectedUser.status.toLowerCase()}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div className="detail-card">
                    <span className="detail-label">Current Risk Index</span>
                    <span className="detail-value" style={{ fontSize: '0.85rem' }}>{selectedUser.rating}</span>
                  </div>
                  <div className="detail-card">
                    <span className="detail-label">Joined Date</span>
                    <span className="detail-value" style={{ fontSize: '0.85rem' }}>{selectedUser.joined}</span>
                  </div>
                </div>

                <div className="detail-card" style={{ flex: 1 }}>
                  <span className="detail-label">Interactive Loan History Overview</span>
                  <span className="detail-value history-box" style={{ marginTop: '6px', maxHeight: '100px', overflowY: 'auto' }}>
                    {selectedUser.loanHistory}
                  </span>
                </div>
              </div>

              {/* Right Column: Verified KYC Document Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span className="detail-label" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Verified KYC Identification Papers</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {kycDocs.map((doc) => {
                    const docUrl = getDocUrl(doc.key);
                    const isPdf = doc.type === 'pdf';

                    return (
                      <div 
                        key={doc.key} 
                        className="kyc-doc-card"
                        style={{ cursor: 'pointer', gridColumn: doc.key === 'incomeProof' ? 'span 2' : 'span 1' }}
                        onClick={() => setPreviewFile({ label: doc.label, url: docUrl, type: isPdf ? 'application/pdf' : 'image/png' })}
                      >
                        <div className="doc-preview-wrapper" style={{ height: '90px', position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-input)' }}>
                          {isPdf ? (
                            <div className="pdf-thumbnail-icon" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                              <span style={{ fontSize: '1.4rem' }}>📄</span>
                              <strong style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>PDF STATEMENT</strong>
                            </div>
                          ) : (
                            <img src={docUrl} alt={doc.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                          <div className="doc-preview-hover" style={{ position: 'absolute', inset: 0, background: 'rgba(0, 102, 255, 0.45)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s ease', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            <span>Preview File</span>
                          </div>
                        </div>
                        <div className="doc-card-info" style={{ marginTop: '4px' }}>
                          <span className="doc-card-title" style={{ fontSize: '0.72rem', display: 'block', color: 'var(--admin-text-light)', fontWeight: '600' }}>{doc.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
            
            <div className="modal-footer">
              <button className="btn-primary-admin" onClick={() => setShowViewModal(false)}>Close Portfolio</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX OVERLAY PREVIEWER FOR KYC DOCUMENTS ── */}
      {previewFile && (
        <div className="admin-modal-overlay" style={{ zIndex: 2000 }} onClick={() => setPreviewFile(null)}>
          <div className="admin-modal-container" style={{ width: '650px', background: 'var(--admin-sidebar)', borderRadius: '16px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--admin-text)' }}>{previewFile.label}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)' }}>Secure Sandbox Document Verification Frame</span>
              </div>
              <button className="close-btn" onClick={() => setPreviewFile(null)}>
                <CloseXIcon />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '16px', display: 'flex', justifyContent: 'center', backgroundColor: '#0f111a' }}>
              {previewFile.type === 'application/pdf' ? (
                <div style={{ width: '100%', height: '400px', display: 'flex', flexDirection: 'column' }}>
                  <iframe 
                    src={previewFile.url} 
                    title={previewFile.label} 
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
                  />
                  <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#10b981', textAlign: 'center' }}>
                    ✓ Validation: Document loaded over secure Sandbox protocol
                  </div>
                </div>
              ) : (
                <img 
                  src={previewFile.url} 
                  alt={previewFile.label} 
                  style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', objectFit: 'contain' }} 
                />
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-primary-admin" onClick={() => setPreviewFile(null)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTab;
