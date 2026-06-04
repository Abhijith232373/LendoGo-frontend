import React, { useState } from 'react';

const OverdueCollectionsPanel = () => {
  const [overdues, setOverdues] = useState([
    { id: 'OVD-909', name: 'Anoop Pillai', phone: '95671 88990', originalDue: '₹12,500', penaltyDue: '₹14,200', penaltyDays: 14, creditImpact: '-45 pts', status: 'Needs Action' },
    { id: 'OVD-203', name: 'Sneha George', phone: '98440 22334', originalDue: '₹8,400', penaltyDue: '₹9,850', penaltyDays: 22, creditImpact: '-60 pts', status: 'Needs Action' },
    { id: 'OVD-107', name: 'Rajesh Varma', phone: '97441 00331', originalDue: '₹22,000', penaltyDue: '₹24,900', penaltyDays: 8, creditImpact: '-30 pts', status: 'Warning Sent' }
  ]);

  const handleNotifyOverdue = (id, name, original, penalty, impact) => {
    setOverdues(prev => prev.map(o => o.id === id ? { ...o, status: 'Warning Sent' } : o));
    alert(
      `SYSTEM ALERT: COLLATERAL WARNING DISPATCHED\n\nRecipient: ${name}\nOriginal Due: ${original}\nOverdue Repay Amount (Inc. Penalty): ${penalty}\nCredit Score Impact: ${impact}\n\nCandidate notified of immediate credit score penalty and penalty fee hikes.`
    );
  };

  return (
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
};

export default OverdueCollectionsPanel;
