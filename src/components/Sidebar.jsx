import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// Styles merged from Sidebar.css

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/student-stats', icon: '👨‍🎓', label: 'Student Stats' },
    { path: '/aanganwadi-stats', icon: '🏢', label: 'Aanganwadi Stats' }
  ];

  return (
    <div style={{ 
      width: '260px', 
      minHeight: '100vh', 
      height: '100vh', 
      background: 'linear-gradient(180deg, #1e293b 0%, #334155 50%, #475569 100%)',
      color: '#fff', 
      position: 'fixed', 
      left: 0, 
      top: 0, 
      boxShadow: '8px 0 30px rgba(0, 0, 0, 0.15)', 
      zIndex: 100, 
      overflowY: 'auto',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Logo Section */}
      <div style={{ 
        padding: '32px 24px', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%'
        }}></div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ 
            fontSize: '32px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '12px', 
            padding: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
          }}>
            🌱
          </div>
          <div>
            <div style={{ 
              fontSize: '22px', 
              fontWeight: 800, 
              color: '#fff',
              lineHeight: 1.2,
              letterSpacing: '-0.5px'
            }}>
              HarGhar Munga
            </div>
            <div style={{
              fontSize: '12px',
              opacity: 0.8,
              fontWeight: 500,
              marginTop: '2px'
            }}>
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ padding: '24px 0' }}>
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              padding: '16px 24px', 
              margin: '4px 16px',
              color: isActive(item.path) ? '#fff' : '#cbd5e1', 
              textDecoration: 'none', 
              transition: 'all 0.3s ease', 
              background: isActive(item.path) 
                ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.3), rgba(2, 132, 199, 0.3))'
                : 'transparent',
              borderRadius: '12px',
              border: isActive(item.path) ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
              fontWeight: isActive(item.path) ? 600 : 500,
              fontSize: '15px',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => { 
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'rgba(14, 165, 233, 0.15)'; 
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.borderLeft = '3px solid #0ea5e9';
              }
            }}
            onMouseOut={(e) => { 
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'transparent'; 
                e.currentTarget.style.color = '#cbd5e1';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderLeft = 'none';
              }
            }}
          >
            {isActive(item.path) && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: '#0ea5e9',
                borderRadius: '0 4px 4px 0'
              }}></div>
            )}
            <span style={{ 
              fontSize: '20px', 
              width: '28px', 
              textAlign: 'center',
              filter: isActive(item.path) ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' : 'none'
            }}>
              {item.icon}
            </span>
            <span style={{ fontWeight: 'inherit' }}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Admin Info Section */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: '16px',
        right: '16px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            👤
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
              Admin User
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              System Administrator
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div style={{ 
        position: 'absolute', 
        bottom: '16px', 
        left: '16px', 
        right: '16px' 
      }}>
        <button 
          onClick={onLogout}
          style={{ 
            width: '100%', 
            padding: '16px', 
            background: 'linear-gradient(135deg, #dc2626, #ef4444)', 
            border: 'none', 
            borderRadius: '12px', 
            color: '#fff', 
            fontSize: '15px', 
            fontWeight: 600, 
            cursor: 'pointer', 
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
          onMouseOver={(e) => { 
            e.target.style.transform = 'translateY(-2px)'; 
            e.target.style.boxShadow = '0 12px 35px rgba(239, 68, 68, 0.4)';
          }}
          onMouseOut={(e) => { 
            e.target.style.transform = 'translateY(0)'; 
            e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.3)';
          }}
        >
          <span style={{ fontSize: '18px' }}>🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
