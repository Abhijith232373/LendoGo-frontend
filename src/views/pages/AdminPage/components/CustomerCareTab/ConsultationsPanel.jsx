import React, { useState } from 'react';

const ConsultationsPanel = ({ consultations, handleResolveTicket }) => {
  const [consultFilter, setConsultFilter] = useState('Pending'); // 'Pending' or 'Called'
  const [confirmCallUser, setConfirmCallUser] = useState(null); // { id, name, phone }

  const filteredConsultations = consultations.filter(ticket => ticket.status === consultFilter);

  return (
    <div style={{ width: '100%' }}>
      <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Free Consultations Inquiries</h2>
          <p>Connect with prospective borrowers who requested assistance from the Consultation forms.</p>
        </div>
        <div className="consult-filter-group" style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn-action-outline ${consultFilter === 'Pending' ? 'active' : ''}`}
            onClick={() => setConsultFilter('Pending')}
            style={{
              backgroundColor: consultFilter === 'Pending' ? 'var(--primary)' : 'transparent',
              color: consultFilter === 'Pending' ? '#ffffff' : 'var(--admin-text)',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Pending
          </button>
          <button 
            className={`btn-action-outline ${consultFilter === 'Called' ? 'active' : ''}`}
            onClick={() => setConsultFilter('Called')}
            style={{
              backgroundColor: consultFilter === 'Called' ? 'var(--primary)' : 'transparent',
              color: consultFilter === 'Called' ? '#ffffff' : 'var(--admin-text)',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Called
          </button>
        </div>
      </div>

      <div className="table-responsive-admin">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredConsultations.length > 0 ? (
              filteredConsultations.map(ticket => (
                <tr key={ticket.id}>
                  <td><strong>CNS-{String(ticket.id).padStart(3, '0')}</strong></td>
                  <td>{ticket.name}</td>
                  <td>{ticket.email}</td>
                  <td>{ticket.phone}</td>
                  <td>{ticket.date}</td>
                  <td>
                    <span className={`status-tag ${ticket.status === 'Called' ? 'active' : 'suspended'}`} style={{
                      backgroundColor: ticket.status === 'Called' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                      color: ticket.status === 'Called' ? '#10b981' : '#d97706',
                      border: ticket.status === 'Called' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(217, 119, 6, 0.2)'
                    }}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>
                    {ticket.status === 'Pending' ? (
                      <button 
                        className="btn-action-status activate"
                        style={{
                          width: '88px',
                          height: '32px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0',
                          cursor: 'pointer'
                        }}
                        onClick={() => setConfirmCallUser({ id: ticket.id, name: ticket.name, phone: ticket.phone })}
                      >
                        Call Now
                      </button>
                    ) : (
                      <span className="contact-check" style={{ color: '#10b981', fontWeight: '700', fontSize: '0.82rem' }}>✓ Called</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--admin-text-light)' }}>
                  No {consultFilter.toLowerCase()} consultations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── CONFIRM CALL DIALOG MODAL ─── */}
      {confirmCallUser && (
        <div className="recharge-modal-backdrop" onClick={() => setConfirmCallUser(null)}>
          <div className="recharge-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center', padding: '36px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📞</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--admin-text)' }}>Confirm Outbound Call</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--admin-text-light)', marginBottom: '28px', lineHeight: '1.45' }}>
              Are you sure you want to place a call to <strong>{confirmCallUser.name}</strong> at <strong>{confirmCallUser.phone}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="recharge-btn-cancel" 
                onClick={() => setConfirmCallUser(null)}
              >
                Cancel
              </button>
              <button 
                className="recharge-btn-submit"
                onClick={() => {
                  handleResolveTicket(confirmCallUser.id, confirmCallUser.name);
                  setConfirmCallUser(null);
                }}
              >
                Confirm & Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsPanel;
