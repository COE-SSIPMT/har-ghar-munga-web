import React from 'react';
import Sidebar from '../components/Sidebar';
import InfoBox from '../components/InfoBox';
import CustomPieChart from '../charts/PieChart';
import CustomColumnChart from '../charts/ColumnChart';
// Styles merged from Dashboard.css and Charts.css

const Dashboard = ({ onLogout }) => {
  // Sample data for demo
  const infoBoxData = [
    {
      title: 'Total Students',
      count: '1,247',
      icon: '👥',
      color: 'green'
    },
    {
      title: 'Total Aanganwadi',
      count: '156',
      icon: '🏢',
      color: 'brown'
    },
    {
      title: 'Photos by Students',
      count: '3,892',
      icon: '📸',
      color: 'light-green'
    },
    {
      title: 'Photos by Aanganwadi',
      count: '2,154',
      icon: '🌱',
      color: 'light-brown'
    }
  ];

  const pieChartData = [
    { name: 'Students', value: 1247 },
    { name: 'Aanganwadi Centers', value: 156 },
    { name: 'Active Programs', value: 89 },
    { name: 'Completed Projects', value: 234 }
  ];

  const columnChartData = [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 145 },
    { name: 'Mar', value: 167 },
    { name: 'Apr', value: 189 },
    { name: 'May', value: 203 },
    { name: 'Jun', value: 224 }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%, #f8fafc 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 20s ease infinite',
      overflowX: 'hidden'
    }}>
      <Sidebar onLogout={onLogout} />
      
      <main style={{ 
        flex: 1, 
        marginLeft: '260px', 
        padding: '100px 40px 60px 40px', 
        minHeight: '100vh', 
        width: 'calc(100vw - 260px)', 
        maxWidth: 'calc(100vw - 260px)', 
        boxSizing: 'border-box', 
        overflowY: 'auto', 
        position: 'relative' 
      }}>
        {/* Government Header */}
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: '260px', 
          right: 0, 
          padding: '24px 40px 16px 40px', 
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderBottom: '3px solid #0ea5e9', 
          zIndex: 100, 
          minHeight: '88px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 700, 
                margin: '0 0 6px 0', 
                lineHeight: 1.2, 
                letterSpacing: '0.5px', 
                color: '#ffffff'
              }}>
                छत्तीसगढ़ शासन | HarGhar Munga Dashboard
              </h1>
              <p style={{ 
                fontSize: '14px', 
                color: '#cbd5e1', 
                margin: 0, 
                fontWeight: 500, 
                lineHeight: 1.4 
              }}>
                Government of Chhattisgarh - Nutrition Monitoring System
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(14, 165, 233, 0.2)',
              padding: '12px 20px',
              borderRadius: '8px',
              color: '#0ea5e9',
              fontSize: '14px',
              fontWeight: 600,
              border: '1px solid rgba(14, 165, 233, 0.3)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#22c55e',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
              Official Portal
            </div>
          </div>
        </div>

        {/* Government Welcome Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(30, 41, 59, 0.3)',
          border: '2px solid #0ea5e9'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px'
              }}>
                🏛️
              </div>
              <div>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  marginBottom: '4px', 
                  margin: '0 0 4px 0' 
                }}>
                  Government Administrative Dashboard
                </h2>
                <p style={{ 
                  fontSize: '16px', 
                  opacity: 0.9, 
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  Real-time monitoring of HarGhar Munga Project across Chhattisgarh
                </p>
              </div>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <p style={{ 
                fontSize: '14px', 
                margin: 0, 
                fontWeight: 500,
                opacity: 0.9
              }}>
                📋 Comprehensive nutrition program management | 🏥 Health monitoring system | 📊 Real-time analytics
              </p>
            </div>
          </div>
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '200px',
            height: '200px',
            background: 'rgba(14, 165, 233, 0.1)',
            borderRadius: '50%',
            zIndex: 1
          }}></div>
        </div>

        {/* Info Boxes Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '32px', 
          marginBottom: '48px', 
          width: '100%' 
        }}>
          {infoBoxData.map((item, index) => (
            <InfoBox
              key={index}
              title={item.title}
              count={item.count}
              icon={item.icon}
              color={item.color}
            />
          ))}
        </div>

        {/* Charts Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '40px', 
          width: '100%' 
        }}>
          <div style={{ 
            animation: 'fadeInUp 0.8s ease-out',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            border: '2px solid #e2e8f0',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.12)';
            e.currentTarget.style.borderColor = '#0ea5e9';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                📊
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#1e293b',
                margin: 0
              }}>Distribution Overview</h3>
            </div>
            <CustomPieChart 
              data={pieChartData} 
              title="Distribution Overview" 
            />
          </div>
          
          <div style={{ 
            animation: 'fadeInUp 0.8s ease-out',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            border: '2px solid #e2e8f0',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.12)';
            e.currentTarget.style.borderColor = '#0ea5e9';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                📈
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#1e293b',
                margin: 0
              }}>Monthly Trends</h3>
            </div>
            <CustomColumnChart 
              data={columnChartData} 
              title="Monthly Trends" 
            />
          </div>
        </div>
      </main>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

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
      `}</style>
    </div>
  );
};

export default Dashboard;
