import React, { useState } from 'react';

const DueRemindersPanel = () => {
  const [reminders, setReminders] = useState([
    { id: 'REM-301', name: 'Rohan Sharma', email: 'rohan.s@gmail.com', phone: '98765 43210', loanAmount: '₹3,50,000', dueDate: '06/05/2026', daysRemaining: 6, status: 'Pending Alert' },
    { id: 'REM-402', name: 'Divya Iyer', email: 'divya.iyer@outlook.com', phone: '94471 23456', loanAmount: '₹1,50,000', dueDate: '06/07/2026', daysRemaining: 8, status: 'Reminded' },
    { id: 'REM-105', name: 'Vikram Seth', email: 'vikram.seth@yahoo.com', phone: '90012 34567', loanAmount: '₹5,00,000', dueDate: '06/02/2026', daysRemaining: 3, status: 'Pending Alert' }
  ]);

  const handleSendReminder = (id, name, phone) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'Reminded' } : r));
    alert(`Upcoming payment reminder successfully dispatched to ${name} (${phone}) via SMS & Email!`);
  };

  return (
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
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    backgroundColor: rem.daysRemaining <= 3 ? 'rgba(217, 119, 6, 0.1)' : 'var(--admin-input)',
                    color: rem.daysRemaining <= 3 ? '#d97706' : 'var(--admin-text)',
                    border: rem.daysRemaining <= 3 ? '1px solid rgba(217, 119, 6, 0.2)' : '1px solid var(--admin-border)'
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
};

export default DueRemindersPanel;
