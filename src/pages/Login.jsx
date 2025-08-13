import React, { useState } from 'react';
// Styles merged from Login.css

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation - in real app, you'd validate against backend
    if (credentials.username && credentials.password) {
      onLogin();
    } else {
      alert('Please enter both username and password');
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'relative', 
      overflow: 'hidden', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #667eea 50%, #f093fb 75%, #f5576c 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    }}>
      {/* Animated background overlay */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}></div>
      
      {/* Floating elements */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '100px', height: '100px', background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))', borderRadius: '50%', animation: 'float 6s ease-in-out infinite' }}></div>
      <div style={{ position: 'absolute', top: '70%', right: '15%', width: '80px', height: '80px', background: 'linear-gradient(45deg, rgba(255,255,255,0.08), rgba(255,255,255,0.15))', borderRadius: '50%', animation: 'float 8s ease-in-out infinite reverse' }}></div>
      <div style={{ position: 'absolute', bottom: '20%', left: '20%', width: '60px', height: '60px', background: 'linear-gradient(45deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12))', borderRadius: '50%', animation: 'float 10s ease-in-out infinite' }}></div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px', 
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)', 
        padding: '48px', 
        width: '100%', 
        maxWidth: '420px', 
        position: 'relative', 
        zIndex: 10,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: 'slideUp 0.8s ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '80px', 
            height: '80px', 
            background: 'linear-gradient(135deg, #667eea, #764ba2)', 
            borderRadius: '20px', 
            marginBottom: '20px',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
          }}>
            <span style={{ fontSize: '36px' }}>🌱</span>
          </div>
          <h1 style={{ 
            color: '#2c3e50', 
            fontSize: '32px', 
            fontWeight: 700, 
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>HarGhar Munga</h1>
          <p style={{ color: '#64748b', fontSize: '16px', fontWeight: 500 }}>Admin Dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 600, 
              color: '#374151',
              fontSize: '14px'
            }}>Username</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '16px 20px', 
                borderRadius: '12px', 
                border: '2px solid #e2e8f0', 
                fontSize: '16px', 
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              placeholder="Enter your username"
              required
              onFocus={(e) => { 
                e.target.style.borderColor = '#667eea'; 
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'; 
                e.target.style.background = '#fff';
              }}
              onBlur={(e) => { 
                e.target.style.borderColor = '#e2e8f0'; 
                e.target.style.boxShadow = 'none'; 
                e.target.style.background = 'rgba(255, 255, 255, 0.8)';
              }}
            />
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 600, 
              color: '#374151',
              fontSize: '14px'
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  paddingRight: '55px',
                  borderRadius: '12px', 
                  border: '2px solid #e2e8f0', 
                  fontSize: '16px', 
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                placeholder="Enter your password"
                required
                onFocus={(e) => { 
                  e.target.style.borderColor = '#667eea'; 
                  e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'; 
                  e.target.style.background = '#fff';
                }}
                onBlur={(e) => { 
                  e.target.style.borderColor = '#e2e8f0'; 
                  e.target.style.boxShadow = 'none'; 
                  e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '20px', 
                  color: '#64748b', 
                  transition: 'all 0.3s ease',
                  padding: '4px',
                  borderRadius: '6px'
                }}
                onMouseOver={e => { 
                  e.currentTarget.style.color = '#667eea'; 
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                }}
                onMouseOut={e => { 
                  e.currentTarget.style.color = '#64748b'; 
                  e.currentTarget.style.background = 'none';
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '16px', 
              fontSize: '16px', 
              fontWeight: 600, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              border: 'none', 
              borderRadius: '12px', 
              color: '#fff', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => { 
              e.target.style.transform = 'translateY(-2px)'; 
              e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => { 
              e.target.style.transform = 'translateY(0)'; 
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>Sign In</span>
          </button>
        </form>
        
        {/* Additional UI elements */}
        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Secure Admin Access • HarGhar Munga System
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
