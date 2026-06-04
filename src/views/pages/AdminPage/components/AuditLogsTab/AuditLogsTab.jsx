import React from 'react';
import "./AuditLogsTab.css";

const AuditLogsTab = ({ auditLogs, setAuditLogs }) => {
  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row">
        <h2>Platform Activity & Audit Logs</h2>
        <p>Real-time security log captures access tokens, admin updates, and system events.</p>
      </div>

      <div className="audit-ledger-box">
        <div className="ledger-header-row">
          <span>SECURITY CHRONICLE</span>
          <button className="btn-clear-logs" onClick={() => { setAuditLogs([]); alert('Platform log wiped locally.'); }}>
            Wipe Logs
          </button>
        </div>

        <div className="audit-scroll-ledger">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div className={`log-item-row ${log.type}`} key={log.id}>
                <span className="log-time">{log.timestamp}</span>
                <span className={`log-badge-type ${log.type}`}>{log.type.toUpperCase()}</span>
                <span className="log-operator">[{log.user}]</span>
                <span className="log-action">{log.action}</span>
              </div>
            ))
          ) : (
            <div className="empty-ledger-view">
              <p>No platform logs captured.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogsTab;
