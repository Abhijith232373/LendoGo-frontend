import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const CustomerCareTab = ({ consultations, handleResolveTicket, showOnly }) => {
  // Live Chat Support state
  const [chats, setChats] = useState([
    { id: 'CHT-882', client: 'Arjun Sharma', email: 'arjun@example.com', lastMsg: 'I need to check my loan eligibility for ₹5 Lakhs.', date: '10 mins ago', status: 'Active' },
    { id: 'CHT-199', client: 'Meera Nair', email: 'meera.nair@gmail.com', lastMsg: 'Thank you for updating my profile details.', date: '1 hour ago', status: 'Resolved' },
    { id: 'CHT-094', client: 'Gopal Das', email: 'gopal.das@yahoo.com', lastMsg: 'Is the auto loan disbursal instantaneous?', date: '3 hours ago', status: 'Active' }
  ]);

  // Due Date Reminders state
  const [reminders, setReminders] = useState([
    { id: 'REM-301', name: 'Rohan Sharma', email: 'rohan.s@gmail.com', phone: '98765 43210', loanAmount: '₹3,50,000', dueDate: '06/05/2026', daysRemaining: 6, status: 'Pending Alert' },
    { id: 'REM-402', name: 'Divya Iyer', email: 'divya.iyer@outlook.com', phone: '94471 23456', loanAmount: '₹1,50,000', dueDate: '06/07/2026', daysRemaining: 8, status: 'Reminded' },
    { id: 'REM-105', name: 'Vikram Seth', email: 'vikram.seth@yahoo.com', phone: '90012 34567', loanAmount: '₹5,00,000', dueDate: '06/02/2026', daysRemaining: 3, status: 'Pending Alert' }
  ]);

  // Overdue Collections state
  const [overdues, setOverdues] = useState([
    { id: 'OVD-909', name: 'Anoop Pillai', phone: '95671 88990', originalDue: '₹12,500', penaltyDue: '₹14,200', penaltyDays: 14, creditImpact: '-45 pts', status: 'Needs Action' },
    { id: 'OVD-203', name: 'Sneha George', phone: '98440 22334', originalDue: '₹8,400', penaltyDue: '₹9,850', penaltyDays: 22, creditImpact: '-60 pts', status: 'Needs Action' },
    { id: 'OVD-107', name: 'Rajesh Varma', phone: '97441 00331', originalDue: '₹22,000', penaltyDue: '₹24,900', penaltyDays: 8, creditImpact: '-30 pts', status: 'Warning Sent' }
  ]);

  const [consultFilter, setConsultFilter] = useState('Pending'); // 'Pending' or 'Called'
  const [confirmCallUser, setConfirmCallUser] = useState(null); // { id, name, phone }

  const handleResolveChat = (id, client) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved', lastMsg: 'Thread closed by support agent.' } : c));
    alert(`Chat thread ${id} for ${client} has been marked as Resolved.`);
  };

  const handleSendReminder = (id, name, phone) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'Reminded' } : r));
    alert(`Upcoming payment reminder successfully dispatched to ${name} (${phone}) via SMS & Email!`);
  };

  const handleNotifyOverdue = (id, name, original, penalty, impact) => {
    setOverdues(prev => prev.map(o => o.id === id ? { ...o, status: 'Warning Sent' } : o));
    alert(
      `SYSTEM ALERT: COLLATERAL WARNING DISPATCHED\n\nRecipient: ${name}\nOriginal Due: ${original}\nOverdue Repay Amount (Inc. Penalty): ${penalty}\nCredit Score Impact: ${impact}\n\nCandidate notified of immediate credit score penalty and penalty fee hikes.`
    );
  };

  // 1. FREE CONSULTATION PANEL
  const renderConsultations = () => {
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
                        backgroundColor: ticket.status === 'Called' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: ticket.status === 'Called' ? '#10b981' : '#f59e0b',
                        border: ticket.status === 'Called' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
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
        {confirmCallUser && createPortal(
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
          </div>,
          document.body
        )}
      </div>
    );
  };

  // 2. CHAT SUPPORT PANEL
  const renderChatSupport = () => (
    <div style={{ width: '100%' }}>
      <div className="section-header-row">
        <h2>Customer Support Chat Threads</h2>
        <p>Monitor active chat support requests from prospective and existing borrowers.</p>
      </div>

      <div className="table-responsive-admin">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Thread ID</th>
              <th>Client Name</th>
              <th>Email Contact</th>
              <th>Latest Message</th>
              <th>Received</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {chats.map(chat => (
              <tr key={chat.id}>
                <td><strong>{chat.id}</strong></td>
                <td>{chat.client}</td>
                <td>{chat.email}</td>
                <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <em>"{chat.lastMsg}"</em>
                </td>
                <td>{chat.date}</td>
                <td>
                  <span className={`status-tag ${chat.status === 'Active' ? 'active' : 'closed'}`} style={{
                    backgroundColor: chat.status === 'Active' ? 'rgba(0, 102, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                    color: chat.status === 'Active' ? '#0066ff' : 'var(--admin-text-light)',
                    border: chat.status === 'Active' ? '1px solid rgba(0, 102, 255, 0.2)' : '1px solid var(--admin-border)'
                  }}>
                    {chat.status}
                  </span>
                </td>
                <td>
                  {chat.status === 'Active' ? (
                    <button 
                      className="btn-action-primary"
                      onClick={() => handleResolveChat(chat.id, chat.client)}
                      style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px' }}
                    >
                      Join & Resolve
                    </button>
                  ) : (
                    <span style={{ color: 'var(--admin-text-light)', fontSize: '0.82rem', fontWeight: '700' }}>✓ Resolved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 3. DUE DATE REMINDERS PANEL
  const renderDueReminders = () => (
    <div style={{ width: '100%' }}>
      <div className="section-header-row">
        <h2>Upcoming Due Date Reminders</h2>
        <p>Proactively alert customer profiles regarding upcoming EMI deadlines to avoid penalty fee assessments.</p>
      </div>

      <div className="table-responsive-admin">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Reminder ID</th>
              <th>Customer Name</th>
              <th>Contact Phone</th>
              <th>Loan Amount</th>
              <th>EMI Due Date</th>
              <th>Days Left</th>
              <th>Alert Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map(rem => (
              <tr key={rem.id}>
                <td><strong>{rem.id}</strong></td>
                <td>{rem.name}</td>
                <td>{rem.phone}</td>
                <td><strong>{rem.loanAmount}</strong></td>
                <td>{rem.dueDate}</td>
                <td>
                  <span style={{ 
                    padding: '3px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    backgroundColor: rem.daysRemaining <= 3 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.03)',
                    color: rem.daysRemaining <= 3 ? '#f59e0b' : 'var(--admin-text)',
                    border: rem.daysRemaining <= 3 ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid var(--admin-border)'
                  }}>
                    {rem.daysRemaining} days left
                  </span>
                </td>
                <td>
                  <span className={`status-tag ${rem.status === 'Reminded' ? 'active' : 'suspended'}`}>
                    {rem.status}
                  </span>
                </td>
                <td>
                  {rem.status === 'Pending Alert' ? (
                    <button 
                      className="btn-action-primary"
                      onClick={() => handleSendReminder(rem.id, rem.name, rem.phone)}
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '0.8rem', 
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        border: 'none',
                        boxShadow: '0 2px 6px rgba(245,158,11,0.2)'
                      }}
                    >
                      Call / Send Reminder
                    </button>
                  ) : (
                    <span style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: '700' }}>✓ Notification Sent</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 4. OVERDUE & COLLECTIONS PANEL
  const renderOverdueCollections = () => (
    <div style={{ width: '100%' }}>
      <div className="section-header-row" style={{ borderLeft: '4px solid #ef4444', paddingLeft: '15px' }}>
        <h2>Overdue & Collections Directory</h2>
        <p style={{ color: '#ef4444', fontWeight: '600' }}>
          Critical warning zone: Accounts listed here have defaulted on their due date. Penalty rates will automatically increase repay totals and reduce credit bureau scores by the specified impact.
        </p>
      </div>

      <div className="table-responsive-admin">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Defaulted Client</th>
              <th>Phone Number</th>
              <th>Original EMI Due</th>
              <th>Increased Repay Total</th>
              <th>Credit Score Impact</th>
              <th>Overdue Days</th>
              <th>Action Needed</th>
            </tr>
          </thead>
          <tbody>
            {overdues.map(ovd => (
              <tr key={ovd.id}>
                <td><strong style={{ color: '#ef4444' }}>{ovd.id}</strong></td>
                <td><strong>{ovd.name}</strong></td>
                <td>{ovd.phone}</td>
                <td>{ovd.originalDue}</td>
                <td>
                  <strong style={{ color: '#ef4444' }}>{ovd.penaltyDue}</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)' }}>Includes 15% late penalty</div>
                </td>
                <td>
                  <span style={{ 
                    padding: '3px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: '800',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}>
                    {ovd.creditImpact} Bureau Impact
                  </span>
                </td>
                <td>
                  <strong style={{ color: '#ef4444' }}>{ovd.penaltyDays} Days Overdue</strong>
                </td>
                <td>
                  {ovd.status === 'Needs Action' ? (
                    <button 
                      className="btn-action-secondary"
                      onClick={() => handleNotifyOverdue(ovd.id, ovd.name, ovd.originalDue, ovd.penaltyDue, ovd.creditImpact)}
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '0.8rem', 
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 2px 6px rgba(239,68,68,0.2)'
                      }}
                    >
                      Notify Penalty & Call
                    </button>
                  ) : (
                    <span style={{ color: '#ef4444', fontSize: '0.82rem', fontWeight: '700' }}>Final Warning Sent</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="tab-pane-container animate-fade-in">
      {/* Dynamic Sub-tab views based on selection */}
      {(!showOnly || showOnly === 'consultation') && renderConsultations()}
      {showOnly === 'chat' && renderChatSupport()}
      {showOnly === 'reminders' && renderDueReminders()}
      {showOnly === 'collections' && renderOverdueCollections()}
    </div>
  );
};

export default CustomerCareTab;
