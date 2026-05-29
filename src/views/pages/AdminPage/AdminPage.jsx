import React from 'react';
import { useAdminController } from './hooks/useAdminController';
import './AdminPage.css';

// Import Modular Components
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';
import DashboardTab from './components/DashboardTab';
import UserManagementTab from './components/UserManagementTab';
import LoanApplicationsTab from './components/LoanApplicationsTab';
import KYCVerificationsTab from './components/KYCVerificationsTab';
import RolePermissionsTab from './components/RolePermissionsTab';
import AssignRolesTab from './components/AssignRolesTab';
import CareersManagementTab from './components/CareersManagementTab';
import CustomerCareTab from './components/CustomerCareTab';
import WebConfigurationTab from './components/WebConfigurationTab';
import AuditLogsTab from './components/AuditLogsTab';
import AdminSettingsTab from './components/AdminSettingsTab';

const AdminPage = () => {
  const {
    darkMode, setDarkMode,
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    sidebarCollapsed, setSidebarCollapsed,
    minCreditScore, setMinCreditScore,
    baseInterestRate, setBaseInterestRate,
    isSignupsEnabled, setIsSignupsEnabled,
    isConsultationsEnabled, setIsConsultationsEnabled,
    activeBalance,
    disbursedCapital,
    adminAvatar,
    adminName, setAdminName,
    adminEmail,
    emailInput, setEmailInput,
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    transferEmail, setTransferEmail,
    transferKey, setTransferKey,
    auditLogs, setAuditLogs,
    users,
    kycList,
    loanRequests,
    approvedLoans,
    careersOpenings,
    jobApplications,
    consultations,
    staffMembers,
    newStaffName, setNewStaffName,
    newStaffEmail, setNewStaffEmail,
    newStaffRole, setNewStaffRole,
    liveMarquee,
    showConfigSuccess,
    handleToggleUserStatus,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleApproveKYC,
    handleRejectKYC,
    handleRunRiskAudit,
    handleApproveLoan,
    handleRejectLoan,
    handleDisburseMoney,
    handleToggleJobStatus,
    handleCreateJobOpening,
    handleUpdateApplicantStatus,
    handleRechargeWallet,
    handleResolveTicket,
    handleAddStaff,
    handleUpdateStaffRole,
    handleSaveWebConfig,
    handleSimulatePhotoUpload,
    handleUpdateAdminEmail,
    handleUpdateAdminPassword,
    handleTransferOwnership,
    handleAdminLogout
  } = useAdminController();

  const navItems = [
    { 
      name: 'Dashboard', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9"/>
          <rect x="14" y="3" width="7" height="5"/>
          <rect x="14" y="12" width="7" height="9"/>
          <rect x="3" y="16" width="7" height="5"/>
        </svg>
      )
    },
    { 
      name: 'Loan Applications', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      )
    },
    { 
      name: 'KYC Verifications', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M12 8v4"/>
          <path d="M12 16h.01"/>
        </svg>
      )
    },
    {
      name: 'Administrative',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      isGroup: true,
      subItems: [
        { 
          name: 'User Management', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          )
        },
        { 
          name: 'Role Permissions', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7.5" cy="15.5" r="5.5"/>
              <path d="m21 2-9.6 9.6"/>
              <path d="m15.5 7.5 3 3M17 6l3 3"/>
            </svg>
          )
        },
        { 
          name: 'Assign Roles', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          )
        },
        { 
          name: 'Activity Logs', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
            </svg>
          )
        }
      ]
    },
    { 
      name: 'Careers Management', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      ),
      isGroup: true,
      subItems: [
        {
          name: 'View Applications',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          )
        },
        {
          name: 'Post Job Openings',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          )
        }
      ]
    },
    { 
      name: 'Customer Care', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      isGroup: true,
      subItems: [
        { 
          name: 'Free Consultation', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          )
        },
        { 
          name: 'Chat Support', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )
        },
        { 
          name: 'Due Date Reminders', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          )
        },
        { 
          name: 'Overdue & Collections', 
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          )
        }
      ]
    },
    { 
      name: 'Web Configuration', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      )
    },
    { 
      name: 'Admin Settings', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      )
    }
  ];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.PAN.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`admin-dashboard-wrapper ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      
      {/* ── TOP MARQUEE (LIVE APPROVAL TICKERS) ── */}
      <div className="admin-marquee-bar">
        <div className="marquee-label">
          <span className="live-pulse" />
          LIVE DISBURSEMENTS
        </div>
        <div className="marquee-content">
          <div className="marquee-slider">
            {liveMarquee.map((item, idx) => (
              <span key={idx} className="marquee-item">
                <span className="badge-bullet">{item.status}</span>
                <strong>{item.name}</strong> approved for {item.type}: <span className="highlight-text">{item.amount}</span>
              </span>
            ))}
            {/* Duplicate for infinite loop */}
            {liveMarquee.map((item, idx) => (
              <span key={`dup-${idx}`} className="marquee-item">
                <span className="badge-bullet">{item.status}</span>
                <strong>{item.name}</strong> approved for {item.type}: <span className="highlight-text">{item.amount}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={`admin-main-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        
        {/* Sidebar Component */}
        <AdminSidebar 
          navItems={navItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* ── MAIN DASHBOARD CONTENT AREA ── */}
        <main className="admin-content-area">
          
          {/* Topbar Component */}
          <AdminTopbar 
            disbursedCapital={disbursedCapital}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeBalance={activeBalance}
            adminAvatar={adminAvatar}
            adminName={adminName}
            adminEmail={adminEmail}
            handleRechargeWallet={handleRechargeWallet}
          />

          <div className="dashboard-scroll-container">

            {/* Conditional Tab Views rendering */}
            {activeTab === 'Dashboard' && (
              <DashboardTab 
                activeBalance={activeBalance}
                disbursedCapital={disbursedCapital}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'User Management' && (
              <UserManagementTab 
                filteredUsers={filteredUsers}
                handleToggleUserStatus={handleToggleUserStatus}
                handleCreateUser={handleCreateUser}
                handleUpdateUser={handleUpdateUser}
                handleDeleteUser={handleDeleteUser}
              />
            )}

            {activeTab === 'Loan Applications' && (
              <LoanApplicationsTab 
                loanRequests={loanRequests}
                handleRunRiskAudit={handleRunRiskAudit}
                handleApproveLoan={handleApproveLoan}
                handleRejectLoan={handleRejectLoan}
                approvedLoans={approvedLoans}
                handleDisburseMoney={handleDisburseMoney}
              />
            )}

            {activeTab === 'KYC Verifications' && (
              <KYCVerificationsTab 
                kycList={kycList}
                handleApproveKYC={handleApproveKYC}
                handleRejectKYC={handleRejectKYC}
              />
            )}

            {activeTab === 'View Applications' && (
              <CareersManagementTab 
                careersOpenings={careersOpenings}
                handleToggleJobStatus={handleToggleJobStatus}
                jobApplications={jobApplications}
                handleUpdateApplicantStatus={handleUpdateApplicantStatus}
                showOnly="applications"
              />
            )}

            {activeTab === 'Post Job Openings' && (
              <CareersManagementTab 
                careersOpenings={careersOpenings}
                handleToggleJobStatus={handleToggleJobStatus}
                jobApplications={jobApplications}
                handleUpdateApplicantStatus={handleUpdateApplicantStatus}
                handleCreateJobOpening={handleCreateJobOpening}
                showOnly="jobs"
              />
            )}

            {(activeTab === 'Customer Care' || 
              activeTab === 'Free Consultation' || 
              activeTab === 'Chat Support' || 
              activeTab === 'Due Date Reminders' || 
              activeTab === 'Overdue & Collections') && (
              <CustomerCareTab 
                consultations={consultations}
                handleResolveTicket={handleResolveTicket}
                showOnly={
                  activeTab === 'Free Consultation' ? 'consultation' :
                  activeTab === 'Chat Support' ? 'chat' :
                  activeTab === 'Due Date Reminders' ? 'reminders' :
                  activeTab === 'Overdue & Collections' ? 'collections' : undefined
                }
              />
            )}

            {activeTab === 'Role Permissions' && (
              <RolePermissionsTab />
            )}

            {activeTab === 'Assign Roles' && (
              <AssignRolesTab 
                handleAddStaff={handleAddStaff}
                newStaffName={newStaffName}
                setNewStaffName={setNewStaffName}
                newStaffEmail={newStaffEmail}
                setNewStaffEmail={setNewStaffEmail}
                newStaffRole={newStaffRole}
                setNewStaffRole={setNewStaffRole}
                staffMembers={staffMembers}
                handleUpdateStaffRole={handleUpdateStaffRole}
              />
            )}

            {activeTab === 'Web Configuration' && (
              <WebConfigurationTab 
                showConfigSuccess={showConfigSuccess}
                minCreditScore={minCreditScore}
                setMinCreditScore={setMinCreditScore}
                baseInterestRate={baseInterestRate}
                setBaseInterestRate={setBaseInterestRate}
                isSignupsEnabled={isSignupsEnabled}
                setIsSignupsEnabled={setIsSignupsEnabled}
                isConsultationsEnabled={isConsultationsEnabled}
                setIsConsultationsEnabled={setIsConsultationsEnabled}
                handleSaveWebConfig={handleSaveWebConfig}
              />
            )}

            {(activeTab === 'Audit Logs' || activeTab === 'Activity Logs') && (
              <AuditLogsTab 
                auditLogs={auditLogs}
                setAuditLogs={setAuditLogs}
              />
            )}

            {activeTab === 'Admin Settings' && (
              <AdminSettingsTab 
                adminAvatar={adminAvatar}
                adminName={adminName}
                setAdminName={setAdminName}
                adminEmail={adminEmail}
                handleSimulatePhotoUpload={handleSimulatePhotoUpload}
                handleUpdateAdminEmail={handleUpdateAdminEmail}
                emailInput={emailInput}
                setEmailInput={setEmailInput}
                handleUpdateAdminPassword={handleUpdateAdminPassword}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                handleTransferOwnership={handleTransferOwnership}
                transferEmail={transferEmail}
                setTransferEmail={setTransferEmail}
                transferKey={transferKey}
                setTransferKey={setTransferKey}
                handleAdminLogout={handleAdminLogout}
              />
            )}

          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminPage;
