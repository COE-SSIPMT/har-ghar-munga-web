import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentStats from './pages/StudentStats';
import AanganwadiStats from './pages/AanganwadiStats';
import { getUserSession, clearUserSession } from './utils/cookies';
// Styles merged from App.css

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved session on app load
  useEffect(() => {
    const checkSavedSession = () => {
      try {
        // Check localStorage first
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const adminData = localStorage.getItem('adminData');
        
        if (isLoggedIn === 'true' && adminData) {
          setIsAuthenticated(true);
          console.log('User session restored from localStorage');
        } else {
          // Check cookies for persistent session
          const savedSession = getUserSession();
          if (savedSession) {
            // Restore session to localStorage
            localStorage.setItem('adminData', JSON.stringify(savedSession));
            localStorage.setItem('isLoggedIn', 'true');
            setIsAuthenticated(true);
            console.log('User session restored from cookies');
          }
        }
      } catch (error) {
        console.error('Error checking saved session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSavedSession();
  }, []);

  // Add global styles to body
  useEffect(() => {
    // Apply global styles to document
    document.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    document.body.style.background = 'linear-gradient(135deg, #2d5a27 0%, #8b5a3c 50%, #f5f5f5 100%)';
    document.body.style.minHeight = '100vh';
    document.body.style.width = '100vw';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.boxSizing = 'border-box';
    document.body.style.overflowX = 'hidden';
    
    // Apply global styles to html and body
    document.documentElement.style.width = '100%';
    document.documentElement.style.height = '100%';
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.boxSizing = 'border-box';
    
    // Apply universal selector styles
    const style = document.createElement('style');
    style.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .sidebar-nav-item {
        animation: slideInLeft 0.5s ease-out;
      }
      
      .info-box {
        animation: fadeInUp 0.6s ease-out;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup function
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    console.log('User logged in:', userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('adminData');
    localStorage.removeItem('isLoggedIn');
    
    // Clear cookies
    clearUserSession();
    
    console.log('User logged out and session cleared');
  };

  // Show loading screen while checking for saved session
  if (isLoading) {
    return (
      <>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #065f46 0%, #047857 25%, #059669 50%, #10b981 75%, #34d399 100%);
            color: white;
            font-size: 18px;
            font-weight: 600;
          }
          .loading-content {
            text-align: center;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }
        `}</style>
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div>HarGhar Munga Portal लोड हो रहा है...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
              <Login onLogin={handleLogin} /> : 
              <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/student-stats" 
            element={
              isAuthenticated ? 
              <StudentStats onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/aanganwadi-stats" 
            element={
              isAuthenticated ? 
              <AanganwadiStats onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
