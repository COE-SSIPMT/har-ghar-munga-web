import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import InfoBox from '../components/InfoBox';
// Styles merged from AanganwadiStats.css

const AanganwadiStats = ({ onLogout }) => {
  const [filters, setFilters] = useState({
    kp_id: '',
    ks_id: '',
    k_name: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKendra, setNewKendra] = useState({
    k_name: '',
    k_address: '',
    ks_id: '',
    kp_id: '',
    login_id: '',
    password: ''
  });

  // Sample data based on master_kendra schema
  const [kendras, setKendras] = useState([
    {
      k_id: 1,
      ks_id: 2,
      kp_id: 1,
      k_name: 'CHC रायपुर आंगनवाड़ी केंद्र',
      k_address: 'सेक्टर 19, नया रायपुर, छत्तीसगढ़ - 492002',
      login_id: 'chc_raipur_001',
      password: 'raipur@2024',
      k_createdAt: '2024-01-15T10:30:00Z',
      k_updatedAt: '2024-08-10T14:20:00Z',
      // Related data
      pariyojna_name: 'पोषण आहार कार्यक्रम',
      sector_name: 'ग्रामीण',
      total_students: 45,
      active_students: 42
    },
    {
      k_id: 2,
      ks_id: 1,
      kp_id: 2,
      k_name: 'प्राथमिक स्वास्थ्य केंद्र धरसीवा',
      k_address: 'मुख्य सड़क, धरसीवा, रायपुर, छत्तीसगढ़ - 492004',
      login_id: 'phc_dharsiwa_002',
      password: 'dharsiwa@2024',
      k_createdAt: '2024-02-20T09:15:00Z',
      k_updatedAt: '2024-08-12T16:45:00Z',
      // Related data
      pariyojna_name: 'स्वास्थ्य सेवा कार्यक्रम',
      sector_name: 'शहरी',
      total_students: 60,
      active_students: 58
    },
    {
      k_id: 3,
      ks_id: 2,
      kp_id: 3,
      k_name: 'आंगनवाड़ी केंद्र अरंग',
      k_address: 'वार्ड नंबर 8, अरंग, रायपुर, छत्तीसगढ़ - 493441',
      login_id: 'arang_center_003',
      password: 'arang@2024',
      k_createdAt: '2024-03-10T11:00:00Z',
      k_updatedAt: '2024-08-14T08:30:00Z',
      // Related data
      pariyojna_name: 'शिक्षा एवं विकास कार्यक्रम',
      sector_name: 'ग्रामीण',
      total_students: 38,
      active_students: 35
    },
    {
      k_id: 4,
      ks_id: 1,
      kp_id: 1,
      k_name: 'शहरी आंगनवाड़ी केंद्र सिविल लाइन्स',
      k_address: 'सिविल लाइन्स रोड, रायपुर, छत्तीसगढ़ - 492001',
      login_id: 'civil_lines_004',
      password: 'civillines@2024',
      k_createdAt: '2024-04-05T13:25:00Z',
      k_updatedAt: '2024-08-13T12:15:00Z',
      // Related data
      pariyojna_name: 'पोषण आहार कार्यक्रम',
      sector_name: 'शहरी',
      total_students: 72,
      active_students: 68
    },
    {
      k_id: 5,
      ks_id: 3,
      kp_id: 2,
      k_name: 'ग्रामीण स्वास्थ्य केंद्र महासमुंद',
      k_address: 'ग्राम महासमुंद, तहसील महासमुंद, छत्तीसगढ़ - 493445',
      login_id: 'mahasamund_005',
      password: 'mahasamund@2024',
      k_createdAt: '2024-05-12T07:45:00Z',
      k_updatedAt: '2024-08-11T15:30:00Z',
      // Related data
      pariyojna_name: 'स्वास्थ्य सेवा कार्यक्रम',
      sector_name: 'अर्ध-शहरी',
      total_students: 29,
      active_students: 27
    },
    {
      k_id: 6,
      ks_id: 2,
      kp_id: 3,
      k_name: 'आदिवासी आंगनवाड़ी केंद्र बस्तर',
      k_address: 'जगदलपुर रोड, बस्तर, छत्तीसगढ़ - 494001',
      login_id: 'bastar_tribal_006',
      password: 'bastar@2024',
      k_createdAt: '2024-06-08T14:20:00Z',
      k_updatedAt: '2024-08-09T11:00:00Z',
      // Related data
      pariyojna_name: 'शिक्षा एवं विकास कार्यक्रम',
      sector_name: 'ग्रामीण',
      total_students: 52,
      active_students: 49
    }
  ]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredKendras = kendras.filter(kendra => {
    const matchesSearch = kendra.k_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kendra.k_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kendra.pariyojna_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kendra.sector_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kendra.login_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (!filters.kp_id || kendra.kp_id.toString() === filters.kp_id) &&
      (!filters.ks_id || kendra.ks_id.toString() === filters.ks_id) &&
      (!filters.k_name || kendra.k_name.toLowerCase().includes(filters.k_name.toLowerCase()));
    
    return matchesSearch && matchesFilters;
  });

  const infoBoxData = [
    {
      title: 'कुल केंद्र',
      count: filteredKendras.length.toString(),
      icon: '�',
      color: 'blue'
    },
    {
      title: 'सक्रिय केंद्र',
      count: filteredKendras.filter(k => k.active_students > 0).length.toString(),
      icon: '✅',
      color: 'green'
    },
    {
      title: 'कुल छात्र',
      count: filteredKendras.reduce((sum, k) => sum + k.total_students, 0).toString(),
      icon: '�',
      color: 'brown'
    },
    {
      title: 'सक्रिय छात्र',
      count: filteredKendras.reduce((sum, k) => sum + k.active_students, 0).toString(),
      icon: '�',
      color: 'light-brown'
    }
  ];

  const handleAddKendra = (e) => {
    e.preventDefault();
    const newId = Math.max(...kendras.map(k => k.k_id)) + 1;
    const currentTime = new Date().toISOString();
    setKendras([...kendras, {
      ...newKendra,
      k_id: newId,
      ks_id: parseInt(newKendra.ks_id),
      kp_id: parseInt(newKendra.kp_id),
      k_createdAt: currentTime,
      k_updatedAt: currentTime,
      // Sample related data
      pariyojna_name: getPariyojnaName(parseInt(newKendra.kp_id)),
      sector_name: getSectorName(parseInt(newKendra.ks_id)),
      total_students: 0,
      active_students: 0
    }]);
    setNewKendra({
      k_name: '',
      k_address: '',
      ks_id: '',
      kp_id: '',
      login_id: '',
      password: ''
    });
    setShowAddModal(false);
  };

  const getPariyojnaName = (kp_id) => {
    const pariyojnas = {
      1: 'पोषण आहार कार्यक्रम',
      2: 'स्वास्थ्य सेवा कार्यक्रम',
      3: 'शिक्षा एवं विकास कार्यक्रम'
    };
    return pariyojnas[kp_id] || 'अज्ञात कार्यक्रम';
  };

  const getSectorName = (ks_id) => {
    const sectors = {
      1: 'शहरी',
      2: 'ग्रामीण',
      3: 'अर्ध-शहरी'
    };
    return sectors[ks_id] || 'अज्ञात सेक्टर';
  };

  const handleInputChange = (e) => {
    setNewKendra({
      ...newKendra,
      [e.target.name]: e.target.value
    });
  };

  const getActivityColor = (active, total) => {
    if (total === 0) return '#9ca3af';
    const percentage = (active / total) * 100;
    if (percentage >= 90) return '#10b981';
    if (percentage >= 75) return '#3b82f6';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getActivityBg = (active, total) => {
    if (total === 0) return '#f3f4f6';
    const percentage = (active / total) * 100;
    if (percentage >= 90) return '#dcfce7';
    if (percentage >= 75) return '#dbeafe';
    if (percentage >= 50) return '#fef3c7';
    return '#fee2e2';
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <Sidebar onLogout={onLogout} />
      
      <main style={{ 
        flex: 1, 
        marginLeft: '260px', 
        padding: '120px 32px 32px 32px',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        {/* Government Header */}
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: '260px', 
          right: 0, 
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          padding: '20px 32px',
          borderBottom: '3px solid #0ea5e9',
          zIndex: 50,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 700, 
                color: '#ffffff',
                margin: '0 0 4px 0',
                letterSpacing: '0.5px'
              }}>
                छत्तीसगढ़ शासन | Kendra Management System
              </h1>
              <p style={{ 
                fontSize: '14px', 
                color: '#cbd5e1', 
                margin: 0,
                fontWeight: 500
              }}>
                HarGhar Munga Project - Kendra Centers Portal
              </p>
            </div>
            <div style={{
              background: 'rgba(14, 165, 233, 0.2)',
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              color: '#0ea5e9',
              fontSize: '14px',
              fontWeight: 600
            }}>
              <span style={{ color: '#22c55e', marginRight: '8px' }}>●</span>
              Live Database
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          <InfoBox 
            title="कुल केंद्र" 
            count="156" 
            icon="�" 
            color="blue"
          />
          <InfoBox 
            title="सक्रिय केंद्र" 
            count="142" 
            icon="✅" 
            color="green"
          />
          <InfoBox 
            title="कुल छात्र" 
            count="7,800" 
            icon="�" 
            color="brown"
          />
          <InfoBox 
            title="सक्रिय छात्र" 
            count="6,892" 
            icon="📊" 
            color="light-brown"
          />
        </div>

        {/* Control Panel */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '2px solid #e2e8f0'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                🔍
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 700, 
                color: '#1e293b',
                margin: 0
              }}>
                खोज और फ़िल्टर विकल्प
              </h3>
            </div>
            <button 
              style={{ 
                padding: '14px 28px', 
                background: 'linear-gradient(135deg, #059669, #10b981)', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                fontWeight: 700,
                fontSize: '14px',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onClick={() => setShowAddModal(true)}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
              }}
            >
              + नया केंद्र जोड़ें
            </button>
          </div>
          
          {/* Search Bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="🔍 केंद्र का नाम, पता, परियोजना, सेक्टर या लॉगिन ID से खोजें..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ 
                  width: '100%', 
                  padding: '16px 24px', 
                  paddingRight: '60px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '12px', 
                  fontSize: '16px', 
                  fontWeight: '500',
                  transition: 'all 0.3s ease', 
                  background: 'white', 
                  outline: 'none', 
                  boxSizing: 'border-box' 
                }}
                onFocus={(e) => { 
                  e.target.style.borderColor = '#0ea5e9'; 
                  e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)'; 
                }}
                onBlur={(e) => { 
                  e.target.style.borderColor = '#e2e8f0'; 
                  e.target.style.boxShadow = 'none'; 
                }}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  title="खोज साफ़ करें"
                  style={{ 
                    position: 'absolute', 
                    right: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    background: '#ef4444', 
                    border: 'none', 
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    fontSize: '16px', 
                    color: 'white', 
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    transition: 'all 0.3s ease' 
                  }}
                  onMouseOver={(e) => { e.target.style.background = '#dc2626'; }}
                  onMouseOut={(e) => { e.target.style.background = '#ef4444'; }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>परियोजना ID</label>
              <select
                name="kp_id"
                value={filters.kp_id}
                onChange={handleFilterChange}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: '2px solid #e2e8f0', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  boxSizing: 'border-box',
                  background: 'white',
                  color: '#1e293b'
                }}
              >
                <option value="">सभी परियोजनाएं</option>
                <option value="1">पोषण आहार कार्यक्रम</option>
                <option value="2">स्वास्थ्य सेवा कार्यक्रम</option>
                <option value="3">शिक्षा एवं विकास कार्यक्रम</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>सेक्टर ID</label>
              <select
                name="ks_id"
                value={filters.ks_id}
                onChange={handleFilterChange}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: '2px solid #e2e8f0', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  boxSizing: 'border-box',
                  background: 'white',
                  color: '#1e293b'
                }}
              >
                <option value="">सभी सेक्टर</option>
                <option value="1">शहरी</option>
                <option value="2">ग्रामीण</option>
                <option value="3">अर्ध-शहरी</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>केंद्र का नाम</label>
              <input
                type="text"
                name="k_name"
                value={filters.k_name}
                onChange={handleFilterChange}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: '2px solid #e2e8f0', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  boxSizing: 'border-box',
                  background: 'white',
                  color: '#1e293b'
                }}
                placeholder="केंद्र का नाम खोजें..."
              />
            </div>
          </div>
        </div>

        {/* Info Boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
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

        {/* Kendra Grid */}
        <div style={{ marginTop: '32px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                🏥
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>केंद्र सूची</h3>
            </div>
            {(searchTerm || Object.values(filters).some(f => f)) && (
              <span style={{ 
                fontSize: '14px', 
                color: '#0ea5e9', 
                fontWeight: 600, 
                background: 'rgba(14, 165, 233, 0.1)', 
                padding: '8px 16px', 
                borderRadius: '20px',
                border: '1px solid rgba(14, 165, 233, 0.2)'
              }}>
                {filteredKendras.length} में से {kendras.length} केंद्र दिखाए गए
              </span>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px', width: '100%' }}>
            {filteredKendras.length > 0 ? (
              filteredKendras.map((kendra) => (
              <div key={kendra.k_id} style={{ 
                padding: '24px', 
                background: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '16px', 
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '2px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.borderColor = '#0ea5e9';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                      {kendra.k_name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ 
                        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', 
                        color: 'white', 
                        padding: '4px 12px', 
                        borderRadius: '12px', 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.5px'
                      }}>
                        ID: {kendra.k_id}
                      </span>
                      <span style={{ 
                        background: getActivityBg(kendra.active_students, kendra.total_students),
                        color: getActivityColor(kendra.active_students, kendra.total_students), 
                        padding: '4px 12px', 
                        borderRadius: '12px', 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.5px',
                        border: `1px solid ${getActivityColor(kendra.active_students, kendra.total_students)}30`
                      }}>
                        {kendra.sector_name}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ 
                      background: '#f8fafc', 
                      padding: '12px', 
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>पता</div>
                      <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: 500 }}>📍 {kendra.k_address}</div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ 
                        background: '#eff6ff', 
                        padding: '12px', 
                        borderRadius: '8px',
                        border: '1px solid #bfdbfe',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '12px', color: '#1d4ed8', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>परियोजना</div>
                        <div style={{ color: '#1e40af', fontSize: '13px', fontWeight: 600 }}>{kendra.pariyojna_name}</div>
                      </div>
                      
                      <div style={{ 
                        background: '#f0fdf4', 
                        padding: '12px', 
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '12px', color: '#15803d', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>लॉगिन ID</div>
                        <div style={{ color: '#166534', fontSize: '13px', fontWeight: 600 }}>🔐 {kendra.login_id}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                      छात्र गतिविधि
                    </span>
                    <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 700 }}>
                      {kendra.active_students} / {kendra.total_students}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div 
                      style={{ 
                        width: `${kendra.total_students > 0 ? (kendra.active_students / kendra.total_students) * 100 : 0}%`,
                        backgroundColor: getActivityColor(kendra.active_students, kendra.total_students),
                        height: '100%',
                        borderRadius: '6px',
                        transition: 'all 0.5s ease'
                      }}
                    ></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                    <span>📅 बनाया: {new Date(kendra.k_createdAt).toLocaleDateString('hi-IN')}</span>
                    <span>🔄 अपडेट: {new Date(kendra.k_updatedAt).toLocaleDateString('hi-IN')}</span>
                  </div>
                </div>
              </div>
            ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '60px 40px', 
                background: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '16px', 
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '2px solid #e2e8f0'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}>
                  🔍
                </div>
                <h3 style={{ 
                  color: '#1e293b', 
                  fontSize: '20px', 
                  fontWeight: 700,
                  margin: '0 0 8px 0' 
                }}>
                  कोई केंद्र नहीं मिला
                </h3>
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '16px', 
                  margin: 0,
                  fontWeight: 500
                }}>
                  आपके खोज मापदंडों से मेल खाने वाले कोई केंद्र नहीं मिले।
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add Kendra Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }} onClick={() => setShowAddModal(false)}>
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
              borderRadius: '20px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(14, 165, 233, 0.2)',
              position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '32px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e2e8f0'
              }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    🏥
                  </span>
                  नया केंद्र जोड़ें
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleAddKendra} style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: '#1e293b', 
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      केंद्र आईडी *
                    </label>
                    <input
                      type="text"
                      name="k_id"
                      value={newKendra.k_id}
                      onChange={handleInputChange}
                      placeholder="उदाहरण: K001"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 500,
                        background: '#f8fafc',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0ea5e9';
                        e.target.style.background = '#ffffff';
                        e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.background = '#f8fafc';
                        e.target.style.boxShadow = 'none';
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: '#1e293b', 
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      सेक्टर *
                    </label>
                    <select
                      name="ks_id"
                      value={newKendra.ks_id}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 500,
                        background: '#f8fafc',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0ea5e9';
                        e.target.style.background = '#ffffff';
                        e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.background = '#f8fafc';
                        e.target.style.boxShadow = 'none';
                      }}
                      required
                    >
                      <option value="">सेक्टर चुनें</option>
                      <option value="S001">शिक्षा</option>
                      <option value="S002">स्वास्थ्य</option>
                      <option value="S003">पोषण</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: '#1e293b', 
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      परियोजना *
                    </label>
                    <select
                      name="kp_id"
                      value={newKendra.kp_id}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 500,
                        background: '#f8fafc',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0ea5e9';
                        e.target.style.background = '#ffffff';
                        e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.background = '#f8fafc';
                        e.target.style.boxShadow = 'none';
                      }}
                      required
                    >
                      <option value="">परियोजना चुनें</option>
                      <option value="P001">आंगनवाड़ी विकास</option>
                      <option value="P002">पोषण सुधार</option>
                      <option value="P003">शिक्षा सुधार</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: '#1e293b', 
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      लॉगिन आईडी *
                    </label>
                    <input
                      type="text"
                      name="login_id"
                      value={newKendra.login_id}
                      onChange={handleInputChange}
                      placeholder="उदाहरण: admin001"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 500,
                        background: '#f8fafc',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0ea5e9';
                        e.target.style.background = '#ffffff';
                        e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.background = '#f8fafc';
                        e.target.style.boxShadow = 'none';
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#1e293b', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    केंद्र नाम *
                  </label>
                  <input
                    type="text"
                    name="k_name"
                    value={newKendra.k_name}
                    onChange={handleInputChange}
                    placeholder="केंद्र का नाम दर्ज करें"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                      background: '#f8fafc',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.background = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#1e293b', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    पता *
                  </label>
                  <textarea
                    name="k_address"
                    value={newKendra.k_address}
                    onChange={handleInputChange}
                    placeholder="पूरा पता दर्ज करें"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                      background: '#f8fafc',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.background = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#1e293b', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    पासवर्ड *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={newKendra.password}
                    onChange={handleInputChange}
                    placeholder="सुरक्षित पासवर्ड दर्ज करें"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                      background: '#f8fafc',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.background = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                {/* Modal Actions */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: '16px', 
                  marginTop: '32px',
                  paddingTop: '24px',
                  borderTop: '2px solid #e2e8f0'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #6b7280, #9ca3af)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(107, 114, 128, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    केंद्र जोड़ें
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AanganwadiStats;
