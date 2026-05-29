import React, { useState, useEffect } from 'react';
import "./UserManagementTab.css";
import { apiClient } from '../../../../../utils/apiClient';

const UserManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

// Fetch Users
const fetchUsers = async () => {
    try {
      const res = await apiClient('/admin/all-users');
      const rawUsers = res?.data || res || [];
      
      // Normalize field names from Go backend
      const normalized = rawUsers.map(u => ({
        ...u,
        id: String(u.id || u.ID || u.Id || ''),
        fullName: u.full_name || u.fullName || 'Unknown',
        createdAt: u.created_at || u.createdAt,
        status: u.status || 'Active'
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
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    try {
      await apiClient(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert("Failed to update status. Check backend logs.");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you absolutely sure you want to permanently delete user ${userName}?`)) {
      try {
        await apiClient(`/admin/users/${userId}`, {
          method: 'DELETE'
        });
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await apiClient(`/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          fullName: editName,
          email: editEmail
        })
      });
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, fullName: editName, email: editEmail } : u));
      setShowEditModal(false);
    } catch (err) {
      alert("Failed to update user details.");
    }
  };

  // Modal Handlers
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditName(user.fullName); // 👈 Updated
    setEditEmail(user.email);
    setShowEditModal(true);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  if (loading) return <div className="text-white p-8">Loading real database users...</div>;

  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Borrower Directory</h2>
          <p>Create, inspect, update clearances, or block user accounts in real-time.</p>
        </div>
      </div>

      <div className="table-responsive-admin">
        <table className="admin-data-table w-full text-left">
          <thead>
            <tr>
              <th className="p-4">User ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4 text-center">Action Buttons</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-4 text-gray-300"><strong>USR-{(user.id || '').substring(0, 4).toUpperCase()}</strong></td>
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
                        onClick={() => handleToggleUserStatus(user.id, user.status || 'Active')}
                      >
                        {user.status === 'Active' || !user.status ? 'Block' : 'Activate'}
                      </button>
                      <button 
                        className="bg-red-900/40 text-red-500 px-3 py-1 rounded border border-red-500/20 hover:bg-red-900/60"
                        onClick={() => handleDeleteUser(user.id, user.fullName)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No users found in database.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── EDIT USER MODAL ── */}
      {showEditModal && selectedUser && (
        <div className="admin-modal-overlay flex items-center justify-center fixed inset-0 bg-black/60 z-50" onClick={() => setShowEditModal(false)}>
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-white font-bold">Edit Borrower</h3>
              <button className="text-gray-400 hover:text-white" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <form onSubmit={onSubmitEdit}>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
                  <input type="text" className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Email Address</label>
                  <input type="email" className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" className="px-4 py-2 text-gray-300 hover:text-white" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Updates</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── INSPECT MODAL ── */}
      {showViewModal && selectedUser && (
        <div className="admin-modal-overlay flex items-center justify-center fixed inset-0 bg-black/60 z-50" onClick={() => setShowViewModal(false)}>
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-white font-bold">Borrower Portfolio</h3>
              <button className="text-gray-400 hover:text-white" onClick={() => setShowViewModal(false)}>✕</button>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg mb-4">
                <h4 className="text-lg text-white font-bold">{selectedUser.fullName}</h4> {/* 👈 Updated */}
                <p className="text-sm text-gray-400 mb-4">{selectedUser.id}</p>
                <p className="text-sm text-gray-300"><strong>Email:</strong> {selectedUser.email}</p>
                <p className="text-sm text-gray-300 mt-2">
                    <strong>Status:</strong> <span className={selectedUser.status === 'Blocked' ? 'text-red-400' : 'text-green-400'}>{selectedUser.status || 'Active'}</span>
                </p>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTab;