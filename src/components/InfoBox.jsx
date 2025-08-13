import React from 'react';
// Styles merged from InfoBox.css

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
        primary: '#0284c7',
        gradient: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
        shadow: 'rgba(2, 132, 199, 0.25)',
        light: '#dbeafe'
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
    <div 
      style={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: `0 15px 40px ${colorStyles.shadow}`,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        animation: 'fadeInUp 0.8s ease-out'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = `0 25px 60px ${colorStyles.shadow}`;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = `0 15px 40px ${colorStyles.shadow}`;
      }}
    >
      {/* Background decoration */}
      <div 
        style={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: colorStyles.gradient,
          borderRadius: '50%',
          opacity: 0.1,
          transform: 'translate(30px, -30px)'
        }}
      />
      
      {/* Top border indicator */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '4px', 
          background: colorStyles.gradient
        }}
      />
      
      {/* Icon container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        background: colorStyles.gradient,
        borderRadius: '16px',
        marginBottom: '20px',
        fontSize: '28px',
        color: 'white',
        boxShadow: `0 8px 25px ${colorStyles.shadow}`,
        position: 'relative',
        zIndex: 2
      }}>
        {icon}
      </div>
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#64748b',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          lineHeight: 1.4
        }}>
          {title}
        </h3>
        
        <div style={{
          fontSize: '36px',
          fontWeight: 800,
          color: '#1e293b',
          marginBottom: '16px',
          lineHeight: 1.1,
          background: colorStyles.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'countUp 1.5s ease-out'
        }}>
          {count}
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '4px',
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '2px',
          marginBottom: '16px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '75%',
            height: '100%',
            background: colorStyles.gradient,
            borderRadius: '2px',
            animation: 'progressFill 2s ease-out'
          }}></div>
        </div>

        {/* Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{
            fontSize: '12px',
            color: '#64748b',
            fontWeight: 500
          }}>
            Live Data
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              background: '#22c55e',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{
              fontSize: '12px',
              color: '#22c55e',
              fontWeight: 600
            }}>
              Active
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes progressFill {
          from { width: 0%; }
          to { width: 75%; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default InfoBox;
