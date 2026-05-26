import React from 'react';

const LoanApprovalsTab = ({ approvedLoans }) => {
  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row">
        <h2>Sanctioned Disbursements Ledger</h2>
        <p>Verify bank transfer completions, locked interest rates, and loan payment timelines.</p>
      </div>

      <div className="table-responsive-admin">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Borrower</th>
              <th>Type</th>
              <th>Capital Sanctioned</th>
              <th>Interest P.A.</th>
              <th>Sanction Date</th>
              <th>Disbursal Status</th>
            </tr>
          </thead>
          <tbody>
            {approvedLoans.map((loan) => (
              <tr key={loan.id}>
                <td><strong>{loan.id}</strong></td>
                <td>{loan.name}</td>
                <td>{loan.type}</td>
                <td className="text-primary font-weight-bold">₹{loan.amount.toLocaleString('en-IN')}</td>
                <td>{loan.rate}% Fixed</td>
                <td>{loan.date}</td>
                <td>
                  <span className="status-badge completed">
                    {loan.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanApprovalsTab;
