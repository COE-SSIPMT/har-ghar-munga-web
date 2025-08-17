import React from 'react';
import '../styles/unified.css';

const InfoBox = ({ title, count, icon, color }) => {
  const getColorStyles = (color) => {
    const colorMap = {
      green: {
        primary: '#059669',
        gradient: 'linear-gradient(135deg, #059669, #10b981)',
        shadow: 'rgba(5, 150, 105, 0.25)',
        light: '#d1fae5'
      },
      brown: {
        primary: '#92400e',
        gradient: 'linear-gradient(135deg, #92400e, #d97706)',
        shadow: 'rgba(146, 64, 14, 0.25)',
        light: '#fef3c7'
      },
      'light-green': {
        primary: '#16a34a',
        gradient: 'linear-gradient(135deg, #16a34a, #22c55e)',
        shadow: 'rgba(22, 163, 74, 0.25)',
        light: '#dcfce7'
      },
      'light-brown': {
        primary: '#d97706',
        gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
        shadow: 'rgba(217, 119, 6, 0.25)',
        light: '#fef3c7'
      },
      blue: {
        primary: '#22c55e',
        gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
        shadow: 'rgba(34, 197, 94, 0.25)',
        light: '#dcfce7'
      },
      red: {
        primary: '#dc2626',
        gradient: 'linear-gradient(135deg, #dc2626, #ef4444)',
        shadow: 'rgba(220, 38, 38, 0.25)',
        light: '#fee2e2'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const colorStyles = getColorStyles(color);

  return (
    <div className={`info-box ${color}`}>
      {/* Background decoration */}
      <div className="info-box-decoration"></div>
      
      {/* Top border indicator */}
      <div className="info-box-border"></div>
      
      {/* Icon container */}
      <div className="info-box-icon">
        {icon}
      </div>
      
      {/* Content */}
      <div className="info-box-content">
        <h3 className="info-box-title">
          {title}
        </h3>
        
        <div className="info-box-count">
          {count}
        </div>

        {/* Progress bar */}
        <div className="info-box-progress">
          <div className="info-box-progress-bar"></div>
        </div>

        {/* Status */}
        <div className="info-box-status">
          <span className="info-box-status-label">
            Live Data
          </span>
          <div className="info-box-status-indicator">
            <div className="info-box-status-dot"></div>
            <span className="info-box-status-text">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
