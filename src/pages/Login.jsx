import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Sprout, Shield, Building, Rocket, Flag } from 'lucide-react';
import logoImage from '/images/logo.jpg';
import '../styles/unified.css';

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
      background: 'linear-gradient(135deg, #065f46 0%, #047857 25%, #059669 50%, #10b981 75%, #34d399 100%)',
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
          background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
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
              width: '280px',
              height: '170px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
              borderRadius: '25px',
              padding: '12px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              animation: 'logoGlow 4s ease-in-out infinite'
            }}>
              <img 
                src={logoImage} 
                alt="HarGhar Munga Logo" 
                style={{
                  width: '92%',
                  height: '92%',
                  objectFit: 'cover',
                  borderRadius: '18px',
                  transition: 'all 0.3s ease',
                  filter: 'brightness(1.1) contrast(1.1)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
                }}
                onError={(e) => {
                  console.log('Image failed to load, trying PNG version');
                  e.target.src = '/images/logo.png';
                  e.target.onerror = () => {
                    console.log('PNG version also failed, using fallback');
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; font-size: 50px; color: white;"><span id="sprout-icon"></span></div>';
                    // Add Sprout icon
                    const sproutContainer = document.getElementById('sprout-icon');
                    if (sproutContainer) {
                      // This will render as a Lucide icon
                      sproutContainer.innerHTML = '<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.7 4.3-1.4 1--.6 1.7-1.5 2.1-2.6-2.6-.1-4.2.5-5.3 1.8z"/></svg>';
                    }
                  };
                }}
                onLoad={() => {
                  console.log('Logo loaded successfully');
                }}
              />
            </div>
            
            <h1 style={{ 
              color: 'white', 
              fontSize: '48px', 
              fontWeight: 800, 
              marginBottom: '16px',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.2)',
              lineHeight: '1.2',
              background: 'linear-gradient(45deg, #ffffff, #f0fdf4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'textGlow 3s ease-in-out infinite alternate'
            }}>HarGhar Munga</h1>
            
            <div style={{
              width: '50px',
              height: '3px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.8), rgba(34,197,94,0.8), rgba(255,255,255,0.8))',
              borderRadius: '2px',
              margin: '0 auto 20px auto',
              animation: 'shimmer 2s ease-in-out infinite'
            }}></div>
            
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.95)', 
              fontSize: '20px', 
              fontWeight: 600,
              marginBottom: '16px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              animation: 'fadeInUp 1s ease-out 0.5s both',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <Building size={22} color="rgba(255, 255, 255, 0.9)" />
              Admin Dashboard
            </p>
            
            {/* Powered by section */}
            <div style={{
              marginTop: 'auto',
              paddingTop: '25px',
              borderTop: '2px solid rgba(255, 255, 255, 0.3)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              borderRadius: '15px',
              padding: '20px',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              animation: 'fadeInUp 1s ease-out 1s both'
            }}>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '13px',
                fontWeight: 600,
                margin: 0,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <Flag size={16} color="rgba(255, 255, 255, 0.9)" />
                Powered by
              </p>
              <p style={{
                color: 'rgba(255, 255, 255, 1)',
                fontSize: '16px',
                fontWeight: 700,
                margin: '5px 0 0 0',
                letterSpacing: '0.8px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                SSIPMT Raipur
              </p>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '11px',
                fontWeight: 500,
                margin: '3px 0 0 0',
                letterSpacing: '0.4px',
                opacity: 0.9
              }}>
                Version 1.0.0 • छत्तीसगढ़ शासन
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
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ 
                color: '#1e293b', 
                fontSize: '30px', 
                fontWeight: 800, 
                marginBottom: '12px',
                background: 'linear-gradient(135deg, #065f46, #059669)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <Lock size={28} color="#059669" />
                Welcome Back
              </h2>
              <p style={{ color: '#64748b', fontSize: '16px', fontWeight: 600 }}>
                Secure Government Portal Access
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
                    e.target.style.borderColor = '#22c55e'; 
                    e.target.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.1)'; 
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
                      e.target.style.borderColor = '#22c55e'; 
                      e.target.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.1)'; 
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
                      e.currentTarget.style.color = '#22c55e'; 
                      e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
                    }}
                    onMouseOut={e => { 
                      e.currentTarget.style.color = '#64748b'; 
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                style={{ 
                  width: '100%', 
                  padding: '18px 24px', 
                  fontSize: '16px', 
                  fontWeight: 700, 
                  background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)', 
                  border: 'none', 
                  borderRadius: '16px', 
                  color: '#fff', 
                  cursor: 'pointer', 
                  transition: 'all 0.4s ease',
                  boxShadow: '0 10px 35px rgba(6, 95, 70, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.25)',
                  position: 'relative',
                  overflow: 'hidden',
                  textTransform: 'none',
                  letterSpacing: '0.3px',
                  minHeight: '58px',
                  outline: 'none'
                }}
                onMouseOver={(e) => { 
                  e.target.style.transform = 'translateY(-2px)'; 
                  e.target.style.boxShadow = '0 8px 25px rgba(6, 95, 70, 0.4)';
                }}
                onMouseOut={(e) => { 
                  e.target.style.transform = 'translateY(0)'; 
                  // e.target.style.boxShadow = '0 6px 20px rgba(6, 95, 70, 0.3)';
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>Sign In to Dashboard</span>
              </button>
            </form>
            
            {/* Additional UI elements */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '32px', 
              paddingTop: '24px', 
              borderTop: '2px solid #e2e8f0',
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.05))',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <p style={{ 
                color: '#059669', 
                fontSize: '15px', 
                margin: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px',
                fontWeight: 600
              }}>
                {/* <Lock size={18} /> */}
                <Shield size={18} color="#059669" />
                Secure Government Access
              </p>
              <p style={{
                color: '#64748b',
                fontSize: '12px',
                margin: '8px 0 0 0',
                fontStyle: 'italic'
              }}>
                Protected by Advanced Encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;