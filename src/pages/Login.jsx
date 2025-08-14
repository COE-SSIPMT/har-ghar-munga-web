import React, { useState } from 'react';
import logoImage from '/images/logo.jpg';
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
        width: '100%', 
        maxWidth: '1200px', 
        position: 'relative', 
        zIndex: 10,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: 'slideUp 0.8s ease-out',
        display: 'flex',
        overflow: 'hidden',
        minHeight: '650px'
      }}>
        {/* Left Section - Logo and Website Name */}
        <div style={{
          flex: '1',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="rgba(255,255,255,0.05)" fill-rule="evenodd"%3E%3Cpath d="m0 40l40-40h-40v40zm40 0v-40h-40l40 40z"/%3E%3C/g%3E%3C/svg%3E")',
            opacity: '0.1'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              width: '210px',
              height: '127px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              borderRadius: '25px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <img 
                src={logoImage} 
                alt="HarGhar Munga Logo" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '20px'
                }}
                onError={(e) => {
                  console.log('Image failed to load, trying PNG version');
                  e.target.src = '/images/logo.png';
                  e.target.onerror = () => {
                    console.log('PNG version also failed, using fallback');
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span style="font-size: 50px; color: white;">🌱</span>';
                  };
                }}
                onLoad={() => {
                  console.log('Logo loaded successfully');
                }}
              />
            </div>
            
            <h1 style={{ 
              color: 'white', 
              fontSize: '42px', 
              fontWeight: 700, 
              marginBottom: '16px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              lineHeight: '1.2'
            }}>HarGhar Munga</h1>
            
            <div style={{
              width: '50px',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '2px',
              margin: '0 auto 20px auto'
            }}></div>
            
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '18px', 
              fontWeight: 500,
              marginBottom: '16px'
            }}>Admin Dashboard</p>
            
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '15px', 
              fontWeight: 400,
              lineHeight: '1.5',
              maxWidth: '280px',
              marginBottom: '24px'
            }}>
              Secure access to manage student statistics, Aanganwadi centers, and administrative operations
            </p>
            
            {/* Powered by section */}
            <div style={{
              marginTop: 'auto',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '12px',
                fontWeight: 500,
                margin: 0,
                letterSpacing: '0.4px'
              }}>
                Powered by
              </p>
              <p style={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: '14px',
                fontWeight: 600,
                margin: '3px 0 0 0',
                letterSpacing: '0.6px'
              }}>
                SSIPMT Raipur
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div style={{
          flex: '1',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '360px', margin: '0 auto', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ 
                color: '#2c3e50', 
                fontSize: '26px', 
                fontWeight: 700, 
                marginBottom: '8px'
              }}>Welcome Back</h2>
              <p style={{ color: '#64748b', fontSize: '15px', fontWeight: 500 }}>
                Sign in to your account
              </p>
            </div>
            
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div style={{ marginBottom: '22px' }}>
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
                    padding: '14px 18px', 
                    borderRadius: '12px', 
                    border: '2px solid #e2e8f0', 
                    fontSize: '16px', 
                    boxSizing: 'border-box',
                    background: '#ffffff',
                    color: '#1e293b',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  placeholder="Enter your username"
                  required
                  onFocus={(e) => { 
                    e.target.style.borderColor = '#667eea'; 
                    e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'; 
                    e.target.style.background = '#ffffff';
                    e.target.style.color = '#1e293b';
                  }}
                  onBlur={(e) => { 
                    e.target.style.borderColor = '#e2e8f0'; 
                    e.target.style.boxShadow = 'none'; 
                    e.target.style.background = '#ffffff';
                    e.target.style.color = '#1e293b';
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '28px' }}>
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
                      padding: '14px 18px', 
                      paddingRight: '50px',
                      borderRadius: '12px', 
                      border: '2px solid #e2e8f0', 
                      fontSize: '16px', 
                      boxSizing: 'border-box',
                      background: '#ffffff',
                      color: '#1e293b',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    placeholder="Enter your password"
                    required
                    onFocus={(e) => { 
                      e.target.style.borderColor = '#667eea'; 
                      e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'; 
                      e.target.style.background = '#ffffff';
                      e.target.style.color = '#1e293b';
                    }}
                    onBlur={(e) => { 
                      e.target.style.borderColor = '#e2e8f0'; 
                      e.target.style.boxShadow = 'none'; 
                      e.target.style.background = '#ffffff';
                      e.target.style.color = '#1e293b';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: 'absolute', 
                      right: '14px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontSize: '18px', 
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
                  padding: '14px', 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  border: 'none', 
                  borderRadius: '12px', 
                  color: '#fff', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => { 
                  e.target.style.transform = 'translateY(-2px)'; 
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                }}
                onMouseOut={(e) => { 
                  e.target.style.transform = 'translateY(0)'; 
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)';
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>Sign In to Dashboard</span>
              </button>
            </form>
            
            {/* Additional UI elements */}
            <div style={{ textAlign: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                🔒 Secure Admin Access
              </p>
            </div>
          </div>
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
