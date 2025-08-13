import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">🌱</div>
          <span className="logo-text">HarGhar Munga</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link 
          to="/dashboard" 
          className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </Link>

        <Link 
          to="/student-stats" 
          className={`nav-item ${isActive('/student-stats') ? 'active' : ''}`}
        >
          <span className="nav-icon">👥</span>
          <span className="nav-text">Student Stats</span>
        </Link>

        <Link 
          to="/aanganwadi-stats" 
          className={`nav-item ${isActive('/aanganwadi-stats') ? 'active' : ''}`}
        >
          <span className="nav-icon">🏢</span>
          <span className="nav-text">Aanganwadi Stats</span>
        </Link>

        <button 
          onClick={onLogout}
          className="nav-item logout-btn"
        >
          <span className="nav-icon">🚪</span>
          <span className="nav-text">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
