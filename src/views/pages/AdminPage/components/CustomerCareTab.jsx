import React from 'react';

const CustomerCareTab = ({ consultations, handleResolveTicket }) => {
  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row">
        <h2>Free Consultations Inquiries</h2>
        <p>Connect with prospective borrowers who requested assistance from the Consultation forms.</p>
      </div>

      <div className="table-responsive-admin">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Client Name</th>
              <th>Email Contact</th>
              <th>Phone Number</th>
              <th>Requested Category</th>
              <th>Registered Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map(ticket => (
              <tr key={ticket.id}>
                <td><strong>{ticket.id}</strong></td>
                <td>{ticket.name}</td>
                <td>{ticket.email}</td>
                <td>{ticket.phone}</td>
                <td>{ticket.type}</td>
                <td>{ticket.date}</td>
                <td>
                  <span className={`status-tag ${ticket.status === 'Contacted' ? 'active' : 'suspended'}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>
                  {ticket.status === 'Pending' ? (
                    <button 
                      className="btn-action-status activate"
                      onClick={() => handleResolveTicket(ticket.id, ticket.name)}
                    >
                      Mark Contacted
                    </button>
                  ) : (
                    <span className="contact-check">✓ Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerCareTab;
