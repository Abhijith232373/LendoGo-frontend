import React, { useState, useEffect } from 'react';
import "./AdminSidebar.css";

const AdminSidebar = ({ navItems, activeTab, setActiveTab, darkMode, setDarkMode, collapsed, setCollapsed }) => {
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

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand-group">
          <div className="admin-logo-icon">L</div>
          {!collapsed && (
            <span className="admin-logo-text">LendoGO <span className="admin-badge-pill">Admin</span></span>
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
              
              return (
                <li key={item.name} className="nav-group-item">
                  <button
                    className={`nav-group-header ${isChildActive ? 'child-active' : ''}`}
                    onClick={() => handleGroupHeaderClick(item)}
                    title={item.name}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!collapsed && <span className="nav-text">{item.name}</span>}
                    {!collapsed && <CaretIcon expanded={isExpanded} />}
                  </button>

                  {isExpanded && !collapsed && (
                    <ul className="nav-sub-list animate-slide-down">
                      {item.subItems.map((sub) => (
                        <li key={sub.name}>
                          <button
                            className={`nav-sub-btn ${activeTab === sub.name ? 'active' : ''}`}
                            onClick={() => setActiveTab(sub.name)}
                            title={sub.name}
                          >
                            <span className="nav-sub-icon">{sub.icon}</span>
                            <span className="nav-sub-text">{sub.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.name}>
                <button
                  className={`nav-btn ${activeTab === item.name ? 'active' : ''}`}
                  onClick={() => handleFlatItemClick(item.name)}
                  title={item.name}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-text">{item.name}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme Switcher Toggle */}
      <div className="sidebar-theme-toggle">
        {!collapsed && (
          <span className="toggle-label">{darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
        )}
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider-round" />
        </label>
      </div>
    </aside>
  );
};

export default AdminSidebar;
