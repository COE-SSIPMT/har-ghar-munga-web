import React from 'react';
import Sidebar from '../components/Sidebar';
import InfoBox from '../components/InfoBox';
import CustomPieChart from '../charts/PieChart';
import CustomColumnChart from '../charts/ColumnChart';
import { Users, Building2, Camera, Sprout, BarChart3, TrendingUp } from 'lucide-react';
import '../styles/unified.css';

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
    <div className="dashboard-container">
      <Sidebar onLogout={onLogout} />
      
      <main className="dashboard-main">
        {/* Government Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-content">
            <div>
              <h1 className="dashboard-title">
                छत्तीसगढ़ शासन | HarGhar Munga Dashboard
              </h1>
              <p className="dashboard-subtitle">
                Government of Chhattisgarh - Nutrition Monitoring System
              </p>
            </div>
            <div className="dashboard-status">
              <div className="status-indicator"></div>
              Official Portal
            </div>
          </div>
        </div>

        {/* Info Boxes Grid */}
        <div className="info-boxes-grid">
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
        <div className="charts-grid">
          <div className="chart-container">
            <div className="chart-header">
              <div className="chart-header-icon">
                <BarChart3 size={20} color="white" />
              </div>
              <h3 className="chart-header-title">Distribution Overview</h3>
            </div>
            <CustomPieChart 
              data={pieChartData} 
              title="Distribution Overview" 
            />
          </div>
          
          <div className="chart-container">
            <div className="chart-header">
              <div className="chart-header-icon">
                <TrendingUp size={20} color="white" />
              </div>
              <h3 className="chart-header-title">Monthly Trends</h3>
            </div>
            <CustomColumnChart 
              data={columnChartData} 
              title="Monthly Trends" 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
