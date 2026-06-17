import React, { useState, useEffect } from 'react';
import "./AdminSidebar.css";

const AdminSidebar = ({ navItems, activeTab, setActiveTab, darkMode, setDarkMode, collapsed, setCollapsed, pendingChatCount = 0, hasPermission = () => true }) => {
  const [expandedGroups, setExpandedGroups] = useState({ Administrative: true });

  // Auto-expand parent group if a sub-tab is set active globally
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.isGroup && item.subItems.some((sub) => sub.name === activeTab)) {
        setExpandedGroups((prev) => ({ ...prev, [item.name]: true }));
      }
    });
  }, [activeTab, navItems]);

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleGroupHeaderClick = (item) => {
    if (collapsed) {
      setCollapsed(false);
      // Auto expand group on sidebar unfold
      setExpandedGroups((prev) => ({ ...prev, [item.name]: true }));
    } else {
      toggleGroup(item.name);
    }
  };

  const handleFlatItemClick = (itemName) => {
    if (collapsed) {
      setCollapsed(false);
    }
    setActiveTab(itemName);
  };

  const CaretIcon = ({ expanded }) => (
    <svg 
      className={`caret-icon ${expanded ? 'rotated' : ''}`}
      width="12" 
      height="12" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ marginLeft: 'auto', transition: 'transform 0.25s ease' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  const ToggleIcon = ({ collapsed }) => (
    <svg 
      className="toggle-chevron"
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );

  const LockIcon = () => (
    <svg 
      className="lock-icon"
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ marginLeft: 'auto', opacity: 0.6 }}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand-group" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781705723/image-removebg-preview_3_lcqqog.png" alt="LendoGO Logo" style={{ width: 'auto', height: '90px', objectFit: 'contain', margin: '-25px -10px', filter: 'drop-shadow(0 4px 6px rgba(0, 102, 255, 0.25))' }} />
          {!collapsed && (
            <span className="admin-badge-pill" style={{ marginLeft: '4px' }}>Admin</span>
          )}
        </div>
        <button 
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ToggleIcon collapsed={collapsed} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => {
            if (item.isGroup) {
              const isExpanded = !!expandedGroups[item.name];
              const isChildActive = item.subItems.some((sub) => sub.name === activeTab);
              const groupPermitted = hasPermission(item.name, item.name);
              
              return (
                <li key={item.name} className="nav-group-item">
                  <button
                    className={`nav-group-header ${isChildActive ? 'child-active' : ''} ${!groupPermitted ? 'locked' : ''}`}
                    onClick={() => groupPermitted && handleGroupHeaderClick(item)}
                    title={!groupPermitted ? "Access Restricted" : item.name}
                    style={{ cursor: !groupPermitted ? 'not-allowed' : 'pointer', opacity: !groupPermitted ? 0.6 : 1 }}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!collapsed && <span className="nav-text">{item.name}</span>}
                    {!collapsed && (groupPermitted ? <CaretIcon expanded={isExpanded} /> : <LockIcon />)}
                  </button>

                  {isExpanded && !collapsed && groupPermitted && (
                    <ul className="nav-sub-list animate-slide-down">
                      {item.subItems.map((sub) => {
                        const subPermitted = hasPermission(sub.name, item.name);
                        return (
                          <li key={sub.name}>
                            <button
                              className={`nav-sub-btn ${activeTab === sub.name ? 'active' : ''} ${!subPermitted ? 'locked' : ''}`}
                              onClick={() => subPermitted && setActiveTab(sub.name)}
                              title={!subPermitted ? "Access Restricted" : sub.name}
                              style={{ cursor: !subPermitted ? 'not-allowed' : 'pointer', opacity: !subPermitted ? 0.6 : 1 }}
                            >
                              <span className="nav-sub-icon">{sub.icon}</span>
                              <span className="nav-sub-text">{sub.name}</span>
                              {!collapsed && !subPermitted && <LockIcon />}
                              {subPermitted && sub.name === 'Chat Support' && pendingChatCount > 0 && (
                                <span className="sidebar-badge-chat-pending">{pendingChatCount}</span>
                              )}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            const itemPermitted = hasPermission(item.name, item.name);
            return (
              <li key={item.name}>
                <button
                  className={`nav-btn ${activeTab === item.name ? 'active' : ''} ${!itemPermitted ? 'locked' : ''}`}
                  onClick={() => itemPermitted && handleFlatItemClick(item.name)}
                  title={!itemPermitted ? "Access Restricted" : item.name}
                  style={{ cursor: !itemPermitted ? 'not-allowed' : 'pointer', opacity: !itemPermitted ? 0.6 : 1 }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-text">{item.name}</span>}
                  {!collapsed && !itemPermitted && <LockIcon />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>


    </aside>
  );
};

export default AdminSidebar;
