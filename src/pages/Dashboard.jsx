import React from 'react';
import Sidebar from '../components/Sidebar';
import InfoBox from '../components/InfoBox';
import CustomPieChart from '../charts/PieChart';
import CustomColumnChart from '../charts/ColumnChart';
import '../styles/Dashboard.css';
import '../styles/Charts.css';

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
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} />
      
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome to HarGhar Munga Admin Panel</p>
        </div>

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

        <div className="charts-grid">
          <div className="chart-wrapper">
            <CustomPieChart 
              data={pieChartData} 
              title="Distribution Overview" 
            />
          </div>
          
          <div className="chart-wrapper">
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
