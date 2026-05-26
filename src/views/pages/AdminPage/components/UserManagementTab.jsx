import React from 'react';

const UserManagementTab = ({ filteredUsers, handleToggleUserStatus }) => {
  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row">
        <h2>Borrower Directory</h2>
        <p>Check active borrow histories, email verifications, and credit standing indexes.</p>
      </div>

      <div className="table-responsive-admin">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>PAN Number</th>
              <th>Risk Index</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.id}</strong></td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><code className="pan-code">{user.PAN}</code></td>
                  <td>
                    <span className={`risk-tag ${user.rating.toLowerCase().replace(' ', '-')}`}>
                      {user.rating}
                    </span>
                  </td>
                  <td>
                    <span className={`status-tag ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.joined}</td>
                  <td>
                    <button 
                      className={`btn-action-status ${user.status === 'Active' ? 'suspend' : 'activate'}`}
                      onClick={() => handleToggleUserStatus(user.id, user.name, user.status)}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
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
    </div>
  );
};

export default UserManagementTab;
