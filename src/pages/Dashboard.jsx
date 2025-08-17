import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import InfoBox from '../components/InfoBox';
import CustomPieChart from '../charts/PieChart';
import CustomColumnChart from '../charts/ColumnChart';
import { Users, Building2, Camera, Sprout, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
import serverURL from './server';
import '../styles/unified.css';

const Dashboard = ({ onLogout }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from API
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${serverURL}hgm_dashboard_web.php`);
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Network error: Unable to fetch dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Default data structure for loading state
  const getInfoBoxData = () => {
    if (!dashboardData) {
      return [
        {
          title: 'Total Students',
          count: '0',
          icon: <Users size={24} />,
          color: 'green'
        },
        {
          title: 'Total Aanganwadi',
          count: '0',
          icon: <Building2 size={24} />,
          color: 'brown'
        },
        {
          title: 'Photos by Students',
          count: '0',
          icon: <Camera size={24} />,
          color: 'light-green'
        },
        {
          title: 'Photos by Aanganwadi',
          count: '0',
          icon: <Sprout size={24} />,
          color: 'light-brown'
        }
      ];
    }

    return [
      {
        title: 'Total Students',
        count: dashboardData.total_students?.toString() || '0',
        icon: <Users size={24} />,
        color: 'green'
      },
      {
        title: 'Total Aanganwadi',
        count: dashboardData.total_aanganwadi?.toString() || '0',
        icon: <Building2 size={24} />,
        color: 'brown'
      },
      {
        title: 'Photos by Students',
        count: dashboardData.photos_by_students?.toString() || '0',
        icon: <Camera size={24} />,
        color: 'light-green'
      },
      {
        title: 'Photos by Aanganwadi',
        count: dashboardData.photos_by_aanganwadi?.toString() || '0',
        icon: <Sprout size={24} />,
        color: 'light-brown'
      }
    ];
  };

  const getPieChartData = () => {
    if (!dashboardData || !dashboardData.pie_chart_data) {
      return [
        { name: 'Students', value: 0 },
        { name: 'Aanganwadi Centers', value: 0 },
        { name: 'Student Photos', value: 0 },
        { name: 'Aanganwadi Photos', value: 0 }
      ];
    }
    return dashboardData.pie_chart_data;
  };

  const getColumnChartData = () => {
    if (!dashboardData || !dashboardData.column_chart_data) {
      return [
        { name: 'Jan', value: 0 },
        { name: 'Feb', value: 0 },
        { name: 'Mar', value: 0 },
        { name: 'Apr', value: 0 },
        { name: 'May', value: 0 },
        { name: 'Jun', value: 0 }
      ];
    }
    return dashboardData.column_chart_data;
  };

  const infoBoxData = getInfoBoxData();
  const pieChartData = getPieChartData();
  const columnChartData = getColumnChartData();

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
              {loading ? 'Loading...' : error ? 'Error' : 'Official Portal'}
              {/* Refresh Button in Header */}
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  marginLeft: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                title="Refresh Dashboard"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #f87171',
            borderRadius: '8px',
            padding: '12px',
            margin: '16px 0',
            color: '#dc2626'
          }}>
            <strong>Error:</strong> {error}
            <button 
              onClick={fetchDashboardData}
              style={{
                marginLeft: '12px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            <div>Loading dashboard data...</div>
          </div>
        )}

        {/* Info Boxes Grid */}
        <div className="info-boxes-grid">
          {infoBoxData.map((item, index) => (
            <InfoBox
              key={index}
              title={item.title}
              count={loading ? 'Loading...' : item.count}
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
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                Loading chart data...
              </div>
            ) : (
              <CustomPieChart 
                data={pieChartData} 
                title="Distribution Overview" 
              />
            )}
          </div>
          
          <div className="chart-container">
            <div className="chart-header">
              <div className="chart-header-icon">
                <TrendingUp size={20} color="white" />
              </div>
              <h3 className="chart-header-title">Monthly Photo Uploads Trends</h3>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                Loading chart data...
              </div>
            ) : (
              <CustomColumnChart 
                data={columnChartData} 
                title="Monthly Photo Uploads Trends" 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
