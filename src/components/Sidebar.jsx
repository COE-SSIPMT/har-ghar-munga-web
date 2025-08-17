import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, GraduationCap, Building2, LogOut, Sprout } from 'lucide-react';
import { clearUserSession } from '../utils/cookies';
import '../styles/unified.css';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/student-stats', icon: GraduationCap, label: 'Student Stats' },
    { path: '/aanganwadi-stats', icon: Building2, label: 'Aanganwadi Stats' }
  ];

  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        {/* Background decoration */}
        <div className="sidebar-logo-decoration"></div>
        
        <div className="sidebar-logo-content">
          <div className="sidebar-logo-icon">
            <Sprout size={32} color="white" />
          </div>
          <div>
            <div className="sidebar-logo-text">
              HarGhar Munga
            </div>
            <div className="sidebar-logo-subtitle">
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            {isActive(item.path) && (
              <div className="sidebar-nav-indicator"></div>
            )}
            <span className="sidebar-nav-icon">
              <item.icon size={20} />
            </span>
            <span>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Admin Info Section */}
      <div className="sidebar-admin-info">
        <div className="sidebar-admin-content">
          <div className="sidebar-admin-avatar">
            👤
          </div>
          <div>
            <div className="sidebar-admin-name">
              Admin User
            </div>
            <div className="sidebar-admin-role">
              System Administrator
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="sidebar-logout">
        <button 
          onClick={() => {
            // Clear all session data
            localStorage.removeItem('adminData');
            localStorage.removeItem('isLoggedIn');
            clearUserSession();
            
            // Call parent logout function
            onLogout();
          }}
          className="logout-button"
          title="सुरक्षित लॉगआउट - सभी session data clear हो जाएगा"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
