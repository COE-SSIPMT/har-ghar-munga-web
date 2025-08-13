import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import InfoBox from '../components/InfoBox';
import '../styles/AanganwadiStats.css';

const AanganwadiStats = ({ onLogout }) => {
  const [filters, setFilters] = useState({
    pariyojna: '',
    sector: '',
    district: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAanganwadi, setNewAanganwadi] = useState({
    name: '',
    address: '',
    district: '',
    sector: '',
    capacity: '',
    currentStrength: '',
    supervisor: '',
    mobile: ''
  });

  // Sample data
  const [aanganwadis, setAanganwadis] = useState([
    {
      id: 1,
      name: 'आंगनवाड़ी केंद्र - नयागांव',
      address: 'गांव - नयागांव, ब्लॉक - पटना सदर',
      district: 'पटना',
      sector: 'ग्रामीण',
      capacity: 50,
      currentStrength: 45,
      supervisor: 'सुमित्रा देवी',
      mobile: '9876543210'
    },
    {
      id: 2,
      name: 'आंगनवाड़ी केंद्र - रामपुर',
      address: 'गांव - रामपुर, ब्लॉक - गया',
      district: 'गया',
      sector: 'ग्रामीण',
      capacity: 60,
      currentStrength: 52,
      supervisor: 'राधा कुमारी',
      mobile: '9876543211'
    },
    {
      id: 3,
      name: 'आंगनवाड़ी केंद्र - शिवपुर',
      address: 'गांव - शिवपुर, ब्लॉक - मुजफ्फरपुर',
      district: 'मुजफ्फरपुर',
      sector: 'ग्रामीण',
      capacity: 40,
      currentStrength: 38,
      supervisor: 'गीता देवी',
      mobile: '9876543212'
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

  const filteredAanganwadis = aanganwadis.filter(aanganwadi => {
    const matchesSearch = aanganwadi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aanganwadi.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aanganwadi.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aanganwadi.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aanganwadi.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const infoBoxData = [
    {
      title: 'Total Aanganwadi',
      count: filteredAanganwadis.length.toString(),
      icon: '🏢',
      color: 'green'
    },
    {
      title: 'Total Capacity',
      count: filteredAanganwadis.reduce((sum, a) => sum + a.capacity, 0).toString(),
      icon: '👥',
      color: 'brown'
    },
    {
      title: 'Current Strength',
      count: filteredAanganwadis.reduce((sum, a) => sum + a.currentStrength, 0).toString(),
      icon: '📊',
      color: 'light-green'
    },
    {
      title: 'Availability',
      count: filteredAanganwadis.length > 0 ? 
        Math.round((filteredAanganwadis.reduce((sum, a) => sum + a.currentStrength, 0) / 
        filteredAanganwadis.reduce((sum, a) => sum + a.capacity, 0)) * 100) + '%' : '0%',
      icon: '📈',
      color: 'light-brown'
    }
  ];

  const handleAddAanganwadi = (e) => {
    e.preventDefault();
    const newId = Math.max(...aanganwadis.map(a => a.id)) + 1;
    setAanganwadis([...aanganwadis, {
      ...newAanganwadi,
      id: newId,
      capacity: parseInt(newAanganwadi.capacity),
      currentStrength: parseInt(newAanganwadi.currentStrength)
    }]);
    setNewAanganwadi({
      name: '',
      address: '',
      district: '',
      sector: '',
      capacity: '',
      currentStrength: '',
      supervisor: '',
      mobile: ''
    });
    setShowAddModal(false);
  };

  const handleInputChange = (e) => {
    setNewAanganwadi({
      ...newAanganwadi,
      [e.target.name]: e.target.value
    });
  };

  const getOccupancyColor = (current, capacity) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return '#F44336';
    if (percentage >= 75) return '#FF9800';
    if (percentage >= 50) return '#2196F3';
    return '#4CAF50';
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} />
      
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Aanganwadi Statistics</h1>
          <p>Manage and view Aanganwadi center information</p>
        </div>

        {/* Filters */}
        <div className="filters-section card">
          <div className="section-header">
            <h3>Search & Filter</h3>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              Add New Aanganwadi
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="🔍 Search Aanganwadi by name, address, district, sector, or supervisor..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="filters-grid">
            <div className="form-group">
              <label className="form-label">Pariyojna</label>
              <select
                name="pariyojna"
                value={filters.pariyojna}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">Select Pariyojna</option>
                <option value="nutrition">Nutrition Program</option>
                <option value="education">Education Program</option>
                <option value="health">Health Program</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sector</label>
              <select
                name="sector"
                value={filters.sector}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">Select Sector</option>
                <option value="ग्रामीण">ग्रामीण</option>
                <option value="शहरी">शहरी</option>
                <option value="अर्ध-शहरी">अर्ध-शहरी</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">District</label>
              <select
                name="district"
                value={filters.district}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">Select District</option>
                <option value="पटना">पटना</option>
                <option value="गया">गया</option>
                <option value="मुजफ्फरपुर">मुजफ्फरपुर</option>
              </select>
            </div>
          </div>
        </div>

        {/* Info Boxes */}
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

        {/* Aanganwadi Grid */}
        <div className="aanganwadi-section">
          <div className="section-header">
            <h3>Aanganwadi Centers</h3>
            {searchTerm && (
              <span className="search-results">
                Showing {filteredAanganwadis.length} of {aanganwadis.length} centers
              </span>
            )}
          </div>
          <div className="aanganwadi-grid">
            {filteredAanganwadis.length > 0 ? (
              filteredAanganwadis.map((aanganwadi) => (
              <div key={aanganwadi.id} className="aanganwadi-card card">
                <div className="aanganwadi-header">
                  <h4>{aanganwadi.name}</h4>
                  <span className="sector-tag">{aanganwadi.sector}</span>
                </div>
                
                <div className="aanganwadi-info">
                  <p><strong>District:</strong> {aanganwadi.district}</p>
                  <p><strong>Address:</strong> {aanganwadi.address}</p>
                  <p><strong>Supervisor:</strong> {aanganwadi.supervisor}</p>
                  <p><strong>Mobile:</strong> {aanganwadi.mobile}</p>
                  
                  <div className="capacity-info">
                    <div className="capacity-bar">
                      <div 
                        className="capacity-fill"
                        style={{ 
                          width: `${(aanganwadi.currentStrength / aanganwadi.capacity) * 100}%`,
                          backgroundColor: getOccupancyColor(aanganwadi.currentStrength, aanganwadi.capacity)
                        }}
                      ></div>
                    </div>
                    <span className="capacity-text">
                      {aanganwadi.currentStrength} / {aanganwadi.capacity} students
                    </span>
                  </div>
                </div>
              </div>
            ))
            ) : (
              <div className="no-results">
                <p>No Aanganwadi centers found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Aanganwadi Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
              <h2>Add New Aanganwadi Center</h2>
              
              <form onSubmit={handleAddAanganwadi} className="add-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Center Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={newAanganwadi.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">District *</label>
                    <select
                      name="district"
                      value={newAanganwadi.district}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select District</option>
                      <option value="पटना">पटना</option>
                      <option value="गया">गया</option>
                      <option value="मुजफ्फरपुर">मुजफ्फरपुर</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sector *</label>
                    <select
                      name="sector"
                      value={newAanganwadi.sector}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select Sector</option>
                      <option value="ग्रामीण">ग्रामीण</option>
                      <option value="शहरी">शहरी</option>
                      <option value="अर्ध-शहरी">अर्ध-शहरी</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Capacity *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={newAanganwadi.capacity}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Strength *</label>
                    <input
                      type="number"
                      name="currentStrength"
                      value={newAanganwadi.currentStrength}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Supervisor Name *</label>
                    <input
                      type="text"
                      name="supervisor"
                      value={newAanganwadi.supervisor}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={newAanganwadi.mobile}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Address *</label>
                    <textarea
                      name="address"
                      value={newAanganwadi.address}
                      onChange={handleInputChange}
                      className="form-input"
                      rows="3"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Aanganwadi
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
