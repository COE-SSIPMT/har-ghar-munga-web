import React from 'react';
import Sidebar from '../components/Sidebar';
import InfoBox from '../components/InfoBox';
import CustomPieChart from '../charts/PieChart';
import CustomColumnChart from '../charts/ColumnChart';
import { Users, Building2, Camera, Sprout, BarChart3, TrendingUp } from 'lucide-react';
// Styles merged from Dashboard.css and Charts.css

const Dashboard = ({ onLogout }) => {
  // Sample data for demo
  const infoBoxData = [
    {
      title: 'Total Students',
      count: '1,247',
      icon: <Users size={24} />,
      color: 'green'
    },
    {
      title: 'Total Aanganwadi',
      count: '156',
      icon: <Building2 size={24} />,
      color: 'brown'
    },
    {
      title: 'Photos by Students',
      count: '3,892',
      icon: <Camera size={24} />,
      color: 'light-green'
    },
    {
      title: 'Photos by Aanganwadi',
      count: '2,154',
      icon: <Sprout size={24} />,
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
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 25%, #bbf7d0 50%, #dcfce7 75%, #f0fdf4 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 20s ease infinite',
      overflowX: 'hidden'
    }}>
      <Sidebar onLogout={onLogout} />
      
      <main style={{ 
        flex: 1, 
        marginLeft: '260px', 
        padding: '120px 40px 60px 40px', 
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
          background: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
          borderBottom: '3px solid #22c55e', 
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
              background: 'rgba(34, 197, 94, 0.2)',
              padding: '12px 20px',
              borderRadius: '8px',
              color: '#22c55e',
              fontSize: '14px',
              fontWeight: 600,
              border: '1px solid rgba(34, 197, 94, 0.3)'
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

        {/* Info Boxes Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '24px', 
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
            e.currentTarget.style.borderColor = '#22c55e';
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
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                <BarChart3 size={20} color="white" />
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
            e.currentTarget.style.borderColor = '#22c55e';
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
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                <TrendingUp size={20} color="white" />
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
