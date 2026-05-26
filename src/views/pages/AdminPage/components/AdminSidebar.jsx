import React from 'react';

const AdminSidebar = ({ navItems, activeTab, setActiveTab, darkMode, setDarkMode }) => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="admin-logo-icon">L</div>
        <span className="admin-logo-text">LendoGO <span className="admin-badge-pill">Admin</span></span>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.name}>
              <button
                className={`nav-btn ${activeTab === item.name ? 'active' : ''}`}
                onClick={() => setActiveTab(item.name)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Theme Switcher Toggle */}
      <div className="sidebar-theme-toggle">
        <span className="toggle-label">{darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
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
