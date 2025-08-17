import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import InfoBox from '../components/InfoBox';
import { Search, Eye, Edit, Baby, X, Phone, User, Weight, Building, AlertTriangle, FileText, Scale, MapPin, Ruler, Calendar, Activity, Hospital, Home, Camera, Image, Download } from 'lucide-react';
import '../styles/unified.css';

const StudentStats = ({ onLogout }) => {
  const [filters, setFilters] = useState({
    sp_id: '',
    ss_id: '',
    sk_id: '',
    s_healtha_status: '',
    s_age: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedStudentPhotos, setSelectedStudentPhotos] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Sample data based on master_student schema
  const students = [
    {
      s_id: 285,
      sp_id: 1,
      ss_id: 2,
      sk_id: 15,
      s_name: 'जया मानिकपुरी',
      s_mobile: 8602214560,
      s_father: 'रामेश कुमार',
      s_mother: 'सुनीता देवी',
      s_height: '95 cm',
      s_weight: '14.5 kg',
      s_age: 3,
      s_dob: '2022-01-15',
      s_healtha_status: 'स्वस्थ',
      s_address: 'वार्ड 12, नयागांव, धरसीवा',
      pariyojna_name: 'पोषण आहार',
      sector_name: 'ग्रामीण',
      kendra_name: 'CHC RAIPUR'
    },
    {
      s_id: 284,
      sp_id: 1,
      ss_id: 2,
      sk_id: 15,
      s_name: 'मनीषा सवारा',
      s_mobile: 9244832337,
      s_father: 'अनिल शर्मा',
      s_mother: 'रीता शर्मा',
      s_height: '98 cm',
      s_weight: '15.2 kg',
      s_age: 4,
      s_dob: '2021-05-20',
      s_healtha_status: 'स्वस्थ',
      s_address: 'मुख्य रोड, रामपुर, अरंग',
      pariyojna_name: 'पोषण आहार',
      sector_name: 'ग्रामीण',
      kendra_name: 'CHC RAIPUR'
    },
    {
      s_id: 283,
      sp_id: 2,
      ss_id: 1,
      sk_id: 12,
      s_name: 'अंजली चेलक',
      s_mobile: 9238189517,
      s_father: 'विजय सिंह',
      s_mother: 'कमला देवी',
      s_height: '102 cm',
      s_weight: '16.8 kg',
      s_age: 4,
      s_dob: '2021-03-10',
      s_healtha_status: 'स्वस्थ',
      s_address: 'टोला नंबर 5, शिवपुर, अरंग',
      pariyojna_name: 'स्वास्थ्य सेवा',
      sector_name: 'शहरी',
      kendra_name: 'आंगनवाड़ी केंद्र 12'
    },
    {
      s_id: 282,
      sp_id: 1,
      ss_id: 2,
      sk_id: 15,
      s_name: 'पायल पटेल',
      s_mobile: 6260202235,
      s_father: 'राम लाल पटेल',
      s_mother: 'गीता देवी',
      s_height: '89 cm',
      s_weight: '12.3 kg',
      s_age: 2,
      s_dob: '2022-11-05',
      s_healtha_status: 'सामान्य',
      s_address: 'पटेल नगर, वार्ड 8, अरंग',
      pariyojna_name: 'पोषण आहार',
      sector_name: 'ग्रामीण',
      kendra_name: 'CHC RAIPUR'
    },
    {
      s_id: 281,
      sp_id: 3,
      ss_id: 2,
      sk_id: 18,
      s_name: 'हिरौंदी साहू',
      s_mobile: 9617722218,
      s_father: 'सुरेश साहू',
      s_mother: 'सुमित्रा साहू',
      s_height: '105 cm',
      s_weight: '18.1 kg',
      s_age: 5,
      s_dob: '2020-08-12',
      s_healtha_status: 'स्वस्थ',
      s_address: 'साहू टोला, मुख्य गांव, अरंग',
      pariyojna_name: 'शिक्षा कार्यक्रम',
      sector_name: 'ग्रामीण',
      kendra_name: 'प्राथमिक स्वास्थ्य केंद्र 18'
    },
    {
      s_id: 280,
      sp_id: 1,
      ss_id: 1,
      sk_id: 10,
      s_name: 'जगेश्वरी टंडन',
      s_mobile: 8253091771,
      s_father: 'अजय टंडन',
      s_mother: 'प्रिया टंडन',
      s_height: '100 cm',
      s_weight: '16.5 kg',
      s_age: 4,
      s_dob: '2021-02-28',
      s_healtha_status: 'स्वस्थ',
      s_address: 'टंडन वार्ड, सेक्टर 3, अरंग',
      pariyojna_name: 'पोषण आहार',
      sector_name: 'शहरी',
      kendra_name: 'शहरी आंगनवाड़ी 10'
    },
    {
      s_id: 279,
      sp_id: 2,
      ss_id: 2,
      sk_id: 15,
      s_name: 'ईश्वरी यादव',
      s_mobile: 9171286949,
      s_father: 'मुकेश यादव',
      s_mother: 'रेखा यादव',
      s_height: '92 cm',
      s_weight: '13.8 kg',
      s_age: 3,
      s_dob: '2022-04-18',
      s_healtha_status: 'स्वस्थ',
      s_address: 'यादव टोला, ग्राम पंचायत, अरंग',
      pariyojna_name: 'स्वास्थ्य सेवा',
      sector_name: 'ग्रामीण',
      kendra_name: 'CHC RAIPUR'
    },
    {
      s_id: 278,
      sp_id: 1,
      ss_id: 2,
      sk_id: 20,
      s_name: 'शशि धीवर',
      s_mobile: 7354894598,
      s_father: 'रामू धीवर',
      s_mother: 'सीता धीवर',
      s_height: '87 cm',
      s_weight: '11.9 kg',
      s_age: 2,
      s_dob: '2023-01-22',
      s_healtha_status: 'कमज़ोर',
      s_address: 'धीवर गांव, तालाब के पास, अरंग',
      pariyojna_name: 'पोषण आहार',
      sector_name: 'ग्रामीण',
      kendra_name: 'ग्रामीण स्वास्थ्य केंद्र 20'
    },
    {
      s_id: 277,
      sp_id: 3,
      ss_id: 1,
      sk_id: 8,
      s_name: 'पल्लवी तांडन',
      s_mobile: 7049534595,
      s_father: 'राकेश तांडन',
      s_mother: 'माला तांडन',
      s_height: '110 cm',
      s_weight: '20.2 kg',
      s_age: 5,
      s_dob: '2020-06-30',
      s_healtha_status: 'स्वस्थ',
      s_address: 'तांडन नगर, कॉलोनी रोड, धरसीवा',
      pariyojna_name: 'शिक्षा कार्यक्रम',
      sector_name: 'शहरी',
      kendra_name: 'प्री-स्कूल केंद्र 8'
    },
    {
      s_id: 276,
      sp_id: 2,
      ss_id: 2,
      sk_id: 22,
      s_name: 'श्याम काली कोल',
      s_mobile: 6262549671,
      s_father: 'हरि कोल',
      s_mother: 'राधा कोल',
      s_height: '96 cm',
      s_weight: '14.8 kg',
      s_age: 3,
      s_dob: '2022-02-14',
      s_healtha_status: 'स्वस्थ',
      s_address: 'कोल बस्ती, पहाड़ी इलाका, धरसीवा',
      pariyojna_name: 'स्वास्थ्य सेवा',
      sector_name: 'ग्रामीण',
      kendra_name: 'पहाड़ी स्वास्थ्य केंद्र 22'
    }
  ];

  // Sample data for dropdowns based on foreign key tables
  const pariyojnaOptions = [
    { p_id: 1, p_name: 'पोषण आहार' },
    { p_id: 2, p_name: 'स्वास्थ्य सेवा' },
    { p_id: 3, p_name: 'शिक्षा कार्यक्रम' }
  ];

  const sectorOptions = [
    { s_id: 1, sp_id: 1, s_name: 'शहरी' },
    { s_id: 2, sp_id: 1, s_name: 'ग्रामीण' },
    { s_id: 3, sp_id: 2, s_name: 'अर्ध-शहरी' }
  ];

  const kendraOptions = [
    { k_id: 8, ks_id: 1, kp_id: 3, k_name: 'प्री-स्कूल केंद्र 8' },
    { k_id: 10, ks_id: 1, kp_id: 1, k_name: 'शहरी आंगनवाड़ी 10' },
    { k_id: 12, ks_id: 1, kp_id: 2, k_name: 'आंगनवाड़ी केंद्र 12' },
    { k_id: 15, ks_id: 2, kp_id: 1, k_name: 'CHC RAIPUR' },
    { k_id: 18, ks_id: 2, kp_id: 3, k_name: 'प्राथमिक स्वास्थ्य केंद्र 18' },
    { k_id: 20, ks_id: 2, kp_id: 1, k_name: 'ग्रामीण स्वास्थ्य केंद्र 20' },
    { k_id: 22, ks_id: 2, kp_id: 2, k_name: 'पहाड़ी स्वास्थ्य केंद्र 22' }
  ];

  const healthStatusOptions = ['स्वस्थ', 'कमज़ोर', 'बीमार', 'सामान्य'];

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.s_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.s_father.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.s_mother.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.kendra_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.s_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.s_healtha_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.pariyojna_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.sector_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (!filters.sp_id || student.sp_id.toString() === filters.sp_id) &&
      (!filters.ss_id || student.ss_id.toString() === filters.ss_id) &&
      (!filters.sk_id || student.sk_id.toString() === filters.sk_id) &&
      (!filters.s_healtha_status || student.s_healtha_status === filters.s_healtha_status) &&
      (!filters.s_age || student.s_age.toString() === filters.s_age);
    
    return matchesSearch && matchesFilters;
  });

  const infoBoxData = [
    {
      title: 'कुल बच्चे',
      count: filteredStudents.length.toString(),
      icon: <User size={24} />,
      color: 'blue'
    },
    {
      title: 'स्वस्थ बच्चे',
      count: filteredStudents.filter(s => s.s_healtha_status === 'स्वस्थ').length.toString(),
      icon: <Activity size={24} />,
      color: 'green'
    },
    {
      title: 'कमज़ोर बच्चे',
      count: filteredStudents.filter(s => s.s_healtha_status === 'कमज़ोर').length.toString(),
      icon: <AlertTriangle size={24} />,
      color: 'brown'
    },
    {
      title: 'सक्रिय रिकॉर्ड',
      count: filteredStudents.length.toString(),
      icon: <FileText size={24} />,
      color: 'light-brown'
    }
  ];

  const openModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const openPhotoModal = (student) => {
    // Sample photo data - यहाँ backend से photos आएंगी
    const photoData = {
      distribution_photo: `https://via.placeholder.com/400x300/22c55e/ffffff?text=Distribution+Photo+${student.s_id}`,
      certificate_photo: `https://via.placeholder.com/400x300/f59e0b/ffffff?text=Certificate+Photo+${student.s_id}`,
      plant_photo: `https://via.placeholder.com/400x300/3b82f6/ffffff?text=Latest+Plant+Photo+${student.s_id}`
    };
    
    setSelectedStudentPhotos({
      student: student,
      photos: photoData
    });
    setShowPhotoModal(true);
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedStudentPhotos(null);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditFormData({
      s_id: student.s_id,
      sp_id: student.sp_id,
      ss_id: student.ss_id,
      sk_id: student.sk_id,
      s_name: student.s_name,
      s_mobile: student.s_mobile,
      s_father: student.s_father,
      s_mother: student.s_mother,
      s_height: student.s_height,
      s_weight: student.s_weight,
      s_age: student.s_age,
      s_dob: student.s_dob,
      s_healtha_status: student.s_healtha_status,
      s_address: student.s_address
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingStudent(null);
    setEditFormData({});
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // यहाँ API call करके database में update करेंगे
    console.log('Updating student:', editFormData);
    alert('✅ स्टूडेंट की जानकारी सफलतापूर्वक अपडेट हो गई!');
    closeEditModal();
  };

  // Filter sectors based on selected pariyojna
  const getFilteredSectors = (selectedPariyojnaId) => {
    return sectorOptions.filter(sector => sector.sp_id === parseInt(selectedPariyojnaId));
  };

  // Filter kendras based on selected sector and pariyojna
  const getFilteredKendras = (selectedSectorId, selectedPariyojnaId) => {
    return kendraOptions.filter(kendra => 
      kendra.ks_id === parseInt(selectedSectorId) && 
      kendra.kp_id === parseInt(selectedPariyojnaId)
    );
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'स्वस्थ': return '#10b981';
      case 'सामान्य': return '#0ea5e9';
      case 'कमज़ोर': return '#f59e0b';
      case 'बीमार': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getHealthStatusBg = (status) => {
    switch (status) {
      case 'स्वस्थ': return '#dcfce7';
      case 'सामान्य': return '#dbeafe';
      case 'कमज़ोर': return '#fef3c7';
      case 'बीमार': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  return (
    <div className="student-stats-container">
      <Sidebar onLogout={onLogout} />
      
      <main className="student-stats-main">
        {/* Government Header */}
        <div className="student-stats-header">
          <div className="student-stats-header-content">
            <div>
              <h1 className="student-stats-title">
                छत्तीसगढ़ शासन | Student Management System
              </h1>
              <p className="student-stats-subtitle">
                HarGhar Munga Project - Student Statistics Portal
              </p>
            </div>
            <div className="student-stats-status">
              <span className="student-status-dot">●</span>
              Live Data
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-header">
            <div className="filters-icon">
              <Search size={20} color="white" />
            </div>
            <h3 className="filters-title">खोज और फ़िल्टर</h3>
          </div>
          
          {/* Search Bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="बच्चे का नाम, माता-पिता का नाम, पता, स्वास्थ्य स्थिति से खोजें..."
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
                  outline: 'none', 
                  boxSizing: 'border-box',
                  background: 'white'
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
                    fontSize: '16px', 
                    color: 'white', 
                    cursor: 'pointer', 
                    padding: '8px', 
                    width: '32px', 
                    height: '32px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    borderRadius: '8px', 
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold'
                  }}
                  onMouseOver={(e) => { e.target.style.background = '#dc2626'; }}
                  onMouseOut={(e) => { e.target.style.background = '#ef4444'; }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', width: '100%' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>परियोजना</label>
              <select
                name="sp_id"
                value={filters.sp_id}
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
                <option value="1">पोषण आहार</option>
                <option value="2">स्वास्थ्य सेवा</option>
                <option value="3">शिक्षा कार्यक्रम</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>सेक्टर</label>
              <select
                name="ss_id"
                value={filters.ss_id}
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
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>केंद्र ID</label>
              <select
                name="sk_id"
                value={filters.sk_id}
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
                <option value="">सभी केंद्र</option>
                <option value="8">प्री-स्कूल केंद्र 8</option>
                <option value="10">शहरी आंगनवाड़ी 10</option>
                <option value="12">आंगनवाड़ी केंद्र 12</option>
                <option value="15">CHC RAIPUR</option>
                <option value="18">प्राथमिक स्वास्थ्य केंद्र 18</option>
                <option value="20">ग्रामीण स्वास्थ्य केंद्र 20</option>
                <option value="22">पहाड़ी स्वास्थ्य केंद्र 22</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>स्वास्थ्य स्थिति</label>
              <select
                name="s_healtha_status"
                value={filters.s_healtha_status}
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
                <option value="">सभी स्थितियां</option>
                <option value="स्वस्थ">स्वस्थ</option>
                <option value="सामान्य">सामान्य</option>
                <option value="कमज़ोर">कमज़ोर</option>
                <option value="बीमार">बीमार</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>उम्र</label>
              <select
                name="s_age"
                value={filters.s_age}
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
                <option value="">सभी उम्र</option>
                <option value="2">2 साल</option>
                <option value="3">3 साल</option>
                <option value="4">4 साल</option>
                <option value="5">5 साल</option>
              </select>
            </div>
          </div>
        </div>

        {/* Info Boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px', width: '100%' }}>
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

        {/* Students Table */}
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
                <FileText size={20} color="white" />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>बच्चों की विस्तृत सूची</h3>
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
                {filteredStudents.length} में से {students.length} बच्चे दिखाए गए
              </span>
            )}
          </div>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            borderRadius: '16px', 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', 
            overflow: 'hidden', 
            marginBottom: '32px', 
            border: '2px solid #e2e8f0' 
          }}>
            {filteredStudents.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead style={{ background: 'linear-gradient(135deg, #166534, #15803d)', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '20px 16px', textAlign: 'left', fontWeight: 700, borderBottom: '3px solid #0ea5e9', fontSize: '14px', whiteSpace: 'nowrap' }}>ID</th>
                    <th style={{ padding: '20px 16px', textAlign: 'left', fontWeight: 700, borderBottom: '3px solid #0ea5e9', fontSize: '14px', whiteSpace: 'nowrap' }}>बच्चे का नाम</th>
                    <th style={{ padding: '20px 16px', textAlign: 'left', fontWeight: 700, borderBottom: '3px solid #0ea5e9', fontSize: '14px', whiteSpace: 'nowrap' }}>माता-पिता</th>
                    <th style={{ padding: '20px 16px', textAlign: 'left', fontWeight: 700, borderBottom: '3px solid #0ea5e9', fontSize: '14px', whiteSpace: 'nowrap' }}>शारीरिक विवरण</th>
                    <th style={{ padding: '20px 16px', textAlign: 'left', fontWeight: 700, borderBottom: '3px solid #0ea5e9', fontSize: '14px', whiteSpace: 'nowrap' }}>जन्म तिथि</th>
                    <th style={{ padding: '20px 16px', textAlign: 'left', fontWeight: 700, borderBottom: '3px solid #0ea5e9', fontSize: '14px', whiteSpace: 'nowrap' }}>स्वास्थ्य स्थिति</th>
                    <th style={{ padding: '20px 16px', textAlign: 'left', fontWeight: 700, borderBottom: '3px solid #0ea5e9', fontSize: '14px', whiteSpace: 'nowrap' }}>केंद्र</th>
                    <th style={{ padding: '20px 16px', textAlign: 'left', fontWeight: 700, borderBottom: '3px solid #0ea5e9', fontSize: '14px', whiteSpace: 'nowrap' }}>परियोजना</th>
                    <th style={{ padding: '20px 16px', textAlign: 'left', fontWeight: 700, borderBottom: '3px solid #0ea5e9', fontSize: '14px', whiteSpace: 'nowrap' }}>पता</th>
                    <th style={{ padding: '20px 16px', textAlign: 'left', fontWeight: 700, borderBottom: '3px solid #0ea5e9', fontSize: '14px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Camera size={16} color="white" />
                        कार्य
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student.s_id} style={{ 
                      borderBottom: '1px solid #e2e8f0', 
                      transition: 'all 0.3s ease', 
                      background: index % 2 === 0 ? 'white' : 'rgba(248, 250, 252, 0.8)' 
                    }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.05)'}
                      onMouseOut={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : 'rgba(248, 250, 252, 0.8)'}
                    >
                      <td style={{ padding: '16px', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', fontSize: '14px' }}>
                        <strong style={{ color: '#0ea5e9', fontWeight: 700, fontSize: '16px' }}>{student.s_id}</strong>
                      </td>
                      <td style={{ padding: '16px', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', fontSize: '14px' }}>
                        <div>
                          <strong style={{ color: '#1e293b', fontWeight: 700, fontSize: '15px', display: 'block', marginBottom: '4px' }}>{student.s_name}</strong>
                          <span style={{ color: '#64748b', fontSize: '13px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>
                            <Phone size={14} style={{ marginRight: '4px' }} />
                            {student.s_mobile}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', fontSize: '14px' }}>
                        <div style={{ lineHeight: '1.4' }}>
                          <div style={{ color: '#1e293b', fontWeight: 600, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={14} color="#1e293b" />
                            {student.s_father}
                          </div>
                          <div style={{ color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={14} color="#1e293b" />
                            {student.s_mother}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', fontSize: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ 
                            background: '#f0f9ff', 
                            color: '#0369a1', 
                            padding: '4px 8px', 
                            borderRadius: '8px', 
                            fontSize: '12px', 
                            fontWeight: 600,
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            <Ruler size={12} color="#0369a1" />
                            {student.s_height}
                          </span>
                          <span style={{ 
                            background: '#f0fdf4', 
                            color: '#166534', 
                            padding: '4px 8px', 
                            borderRadius: '8px', 
                            fontSize: '12px', 
                            fontWeight: 600,
                            textAlign: 'center'
                          }}>
                            <Weight size={14} style={{ marginRight: '4px' }} />
                            {student.s_weight}
                          </span>
                          <span style={{ 
                            background: '#fef7ed', 
                            color: '#c2410c', 
                            padding: '4px 8px', 
                            borderRadius: '8px', 
                            fontSize: '12px', 
                            fontWeight: 600,
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            <Calendar size={12} color="#7c3aed" />
                            {student.s_age} साल
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>
                        {new Date(student.s_dob).toLocaleDateString('hi-IN')}
                      </td>
                      <td style={{ padding: '16px', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', fontSize: '14px' }}>
                        <span style={{ 
                          padding: '8px 16px', 
                          borderRadius: '20px', 
                          fontSize: '13px', 
                          fontWeight: 600, 
                          display: 'inline-block', 
                          textAlign: 'center', 
                          minWidth: '80px',
                          background: getHealthStatusBg(student.s_healtha_status),
                          color: getHealthStatusColor(student.s_healtha_status),
                          border: `1px solid ${getHealthStatusColor(student.s_healtha_status)}30`
                        }}>
                          {student.s_healtha_status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', fontSize: '14px' }}>
                        <div>
                          <strong style={{ color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '4px' }}>{student.kendra_name}</strong>
                          <span style={{ color: '#64748b', fontSize: '12px', background: '#f8fafc', padding: '2px 6px', borderRadius: '8px' }}>
                            ID: {student.sk_id}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', fontSize: '14px' }}>
                        <div>
                          <span style={{ 
                            background: '#eff6ff', 
                            color: '#1d4ed8', 
                            padding: '6px 12px', 
                            borderRadius: '12px', 
                            fontSize: '12px', 
                            fontWeight: 600,
                            display: 'block',
                            textAlign: 'center',
                            marginBottom: '4px'
                          }}>
                            {student.pariyojna_name}
                          </span>
                          <span style={{ 
                            background: '#f0fdf4', 
                            color: '#15803d', 
                            padding: '4px 8px', 
                            borderRadius: '8px', 
                            fontSize: '11px', 
                            fontWeight: 500,
                            display: 'block',
                            textAlign: 'center'
                          }}>
                            {student.sector_name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', fontSize: '13px', color: '#475569', maxWidth: '200px' }}>
                        <div style={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }} title={student.s_address}>
                          <MapPin size={14} color="#64748b" />
                          {student.s_address}
                        </div>
                      </td>
                      <td style={{ padding: '16px', verticalAlign: 'middle', fontSize: '14px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                          <button 
                            onClick={() => openModal(student)}
                            title="विवरण देखें"
                            style={{ 
                              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            <Eye size={12} />
                            
                          </button>
                          <button 
                            title="संपादित करें"
                            onClick={() => openEditModal(student)}
                            style={{ 
                              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            <Edit size={12} />
                            
                          </button>
                          <button 
                            title="� फ़ोटो देखें"
                            onClick={() => openPhotoModal(student)}
                            style={{ 
                              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            <Camera size={12} />
                            
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ 
                padding: '60px 40px', 
                textAlign: 'center',
                background: 'white'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <Search size={48} color="#64748b" />
                </div>
                <h3 style={{ 
                  color: '#1e293b', 
                  fontSize: '20px', 
                  fontWeight: 700,
                  margin: '0 0 8px 0' 
                }}>
                  कोई डेटा नहीं मिला
                </h3>
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '16px', 
                  margin: 0,
                  fontWeight: 500
                }}>
                  आपके खोज मापदंडों से मेल खाने वाले कोई बच्चे नहीं मिले।
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedStudent && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0, 0, 0, 0.6)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }} onClick={closeModal}>
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              maxWidth: '700px', 
              width: '90%', 
              maxHeight: '90vh', 
              overflow: 'hidden', 
              position: 'relative',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              border: '2px solid #e2e8f0'
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div style={{
                background: 'linear-gradient(135deg, #166534, #15803d)',
                color: 'white',
                padding: '24px 32px',
                position: 'relative'
              }}>
                <button 
                  style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    right: '20px', 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    border: 'none', 
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '20px', 
                    cursor: 'pointer', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }} 
                  onClick={closeModal}
                  onMouseOver={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.3)'; }}
                  onMouseOut={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.2)'; }}
                >
                  <X size={20} color="white" />
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px'
                  }}>
                    <Baby size={28} color="white" />
                  </div>
                  <div>
                    <h2 style={{ 
                      fontSize: '24px', 
                      fontWeight: 700, 
                      margin: '0 0 4px 0'
                    }}>
                      बच्चे का संपूर्ण विवरण
                    </h2>
                    <p style={{ 
                      fontSize: '14px', 
                      opacity: 0.9, 
                      margin: 0
                    }}>
                      Student ID: {selectedStudent.s_id} | HarGhar Munga Database
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div style={{ 
                maxHeight: '500px', 
                overflowY: 'auto', 
                padding: '0'
              }}>
                <div style={{ padding: '32px' }}>
                  
                  {/* Personal Information */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 700, 
                      color: '#1e293b', 
                      margin: '0 0 20px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <User size={20} color="#1e293b" />
                      व्यक्तिगत जानकारी
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <label style={{ 
                          fontWeight: 600, 
                          color: '#64748b', 
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>नाम</label>
                        <span style={{ 
                          color: '#1e293b', 
                          fontSize: '16px',
                          fontWeight: 600
                        }}>{selectedStudent.s_name}</span>
                      </div>
                      
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <label style={{ 
                          fontWeight: 600, 
                          color: '#64748b', 
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>मोबाइल नंबर</label>
                        <span style={{ 
                          color: '#1e293b', 
                          fontSize: '16px',
                          fontWeight: 600
                        }}>
                          <Phone size={14} style={{ marginRight: '4px' }} />
                          {selectedStudent.s_mobile}
                        </span>
                      </div>
                      
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <label style={{ 
                          fontWeight: 600, 
                          color: '#64748b', 
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>पिता का नाम</label>
                        <span style={{ 
                          color: '#1e293b', 
                          fontSize: '16px',
                          fontWeight: 600
                        }}>
                          <User size={14} style={{ marginRight: '4px' }} />
                          {selectedStudent.s_father}
                        </span>
                      </div>
                      
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <label style={{ 
                          fontWeight: 600, 
                          color: '#64748b', 
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>माता का नाम</label>
                        <span style={{ 
                          color: '#1e293b', 
                          fontSize: '16px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <User size={14} color="#1e293b" />
                          {selectedStudent.s_mother}
                        </span>
                      </div>
                      
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <label style={{ 
                          fontWeight: 600, 
                          color: '#64748b', 
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>जन्म तिथि</label>
                        <span style={{ 
                          color: '#1e293b', 
                          fontSize: '16px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Calendar size={14} color="#1e293b" />
                          {new Date(selectedStudent.s_dob).toLocaleDateString('hi-IN')}
                        </span>
                      </div>
                      
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <label style={{ 
                          fontWeight: 600, 
                          color: '#64748b', 
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>उम्र</label>
                        <span style={{ 
                          color: '#1e293b', 
                          fontSize: '16px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Calendar size={14} color="#1e293b" />
                          {selectedStudent.s_age} साल
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Physical Details */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 700, 
                      color: '#1e293b', 
                      margin: '0 0 20px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Activity size={20} color="#1e293b" />
                      शारीरिक विवरण
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div style={{ 
                        background: '#f0f9ff', 
                        padding: '20px', 
                        borderRadius: '12px',
                        border: '2px solid #0ea5e9',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                          <Ruler size={24} color="#0369a1" />
                        </div>
                        <label style={{ 
                          fontWeight: 600, 
                          color: '#0369a1', 
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>कद</label>
                        <span style={{ 
                          color: '#0c4a6e', 
                          fontSize: '18px',
                          fontWeight: 700
                        }}>{selectedStudent.s_height}</span>
                      </div>
                      
                      <div style={{ 
                        background: '#f0fdf4', 
                        padding: '20px', 
                        borderRadius: '12px',
                        border: '2px solid #10b981',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                          <Weight size={24} color="#059669" />
                        </div>
                        <label style={{ 
                          fontWeight: 600, 
                          color: '#059669', 
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>वजन</label>
                        <span style={{ 
                          color: '#064e3b', 
                          fontSize: '18px',
                          fontWeight: 700
                        }}>{selectedStudent.s_weight}</span>
                      </div>
                      
                      <div style={{ 
                        background: getHealthStatusBg(selectedStudent.s_healtha_status), 
                        padding: '20px', 
                        borderRadius: '12px',
                        border: `2px solid ${getHealthStatusColor(selectedStudent.s_healtha_status)}`,
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                          <Activity size={24} color={getHealthStatusColor(selectedStudent.s_healtha_status)} />
                        </div>
                        <label style={{ 
                          fontWeight: 600, 
                          color: getHealthStatusColor(selectedStudent.s_healtha_status), 
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>स्वास्थ्य</label>
                        <span style={{ 
                          color: getHealthStatusColor(selectedStudent.s_healtha_status), 
                          fontSize: '18px',
                          fontWeight: 700
                        }}>{selectedStudent.s_healtha_status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Program & Location Details */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 700, 
                      color: '#1e293b', 
                      margin: '0 0 20px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '20px', marginRight: '8px' }}>
                        <Building size={20} />
                      </span> 
                      कार्यक्रम एवं स्थान
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ 
                        background: '#eff6ff', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid #bfdbfe'
                      }}>
                        <label style={{ 
                          fontWeight: 600, 
                          color: '#1d4ed8', 
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>परियोजना</label>
                        <span style={{ 
                          color: '#1e40af', 
                          fontSize: '16px',
                          fontWeight: 600
                        }}>{selectedStudent.pariyojna_name}</span>
                      </div>
                      
                      <div style={{ 
                        background: '#f0fdf4', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid #bbf7d0'
                      }}>
                        <label style={{ 
                          fontWeight: 600, 
                          color: '#15803d', 
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>सेक्टर</label>
                        <span style={{ 
                          color: '#166534', 
                          fontSize: '16px',
                          fontWeight: 600
                        }}>{selectedStudent.sector_name}</span>
                      </div>
                      
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        gridColumn: '1 / -1'
                      }}>
                        <label style={{ 
                          fontWeight: 600, 
                          color: '#64748b', 
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>केंद्र</label>
                        <span style={{ 
                          color: '#1e293b', 
                          fontSize: '16px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Hospital size={14} color="#1e293b" />
                          {selectedStudent.kendra_name} (ID: {selectedStudent.sk_id})
                        </span>
                      </div>
                      
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '16px', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        gridColumn: '1 / -1'
                      }}>
                        <label style={{ 
                          fontWeight: 600, 
                          color: '#64748b', 
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>पूरा पता</label>
                        <span style={{ 
                          color: '#1e293b', 
                          fontSize: '16px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <MapPin size={14} color="#1e293b" />
                          {selectedStudent.s_address}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              
              {/* Modal Footer */}
              <div style={{
                background: '#f8fafc',
                padding: '20px 32px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button 
                  onClick={closeModal}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => { e.target.style.background = '#4b5563'; }}
                  onMouseOut={(e) => { e.target.style.background = '#6b7280'; }}
                >
                  बंद करें
                </button>
                <button 
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.4)'; }}
                  onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                >
                  संपादित करें
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Photo Modal */}
        {showPhotoModal && selectedStudentPhotos && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0, 0, 0, 0.8)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000,
            backdropFilter: 'blur(8px)'
          }} onClick={closePhotoModal}>
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              maxWidth: '1000px', 
              width: '95%', 
              maxHeight: '90vh', 
              overflow: 'hidden', 
              position: 'relative',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
              border: '2px solid #e2e8f0'
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                padding: '24px 32px',
                position: 'relative'
              }}>
                <button 
                  style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    right: '20px', 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    border: 'none', 
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '20px', 
                    cursor: 'pointer', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }} 
                  onClick={closePhotoModal}
                  onMouseOver={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.3)'; }}
                  onMouseOut={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.2)'; }}
                >
                  <X size={20} color="#ffffff" />
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px'
                  }}>
                    <Camera size={28} color="white" />
                  </div>
                  <div>
                    <h2 style={{ 
                      fontSize: '24px', 
                      fontWeight: 700, 
                      margin: '0 0 4px 0'
                    }}>
                      {selectedStudentPhotos.student.s_name} की फ़ोटो गैलरी
                    </h2>
                    <p style={{ 
                      fontSize: '14px', 
                      opacity: 0.9, 
                      margin: 0
                    }}>
                      Student ID: {selectedStudentPhotos.student.s_id} | Photos Collection
                    </p>
                  </div>
                </div>
              </div>

              {/* Photos Grid */}
              <div style={{ 
                padding: '32px',
                maxHeight: '500px', 
                overflowY: 'auto'
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '24px' 
                }}>
                  
                  {/* Distribution Photo */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: 'white',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <Image size={20} color="white" />
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        margin: 0 
                      }}>
                        डिस्ट्रिब्यूशन फ़ोटो
                      </h3>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <img 
                        src={selectedStudentPhotos.photos.distribution_photo}
                        alt="Distribution Photo"
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}
                      />
                      <div style={{ 
                        marginTop: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#64748b',
                          fontWeight: 500
                        }}>
                          पोषण आहार वितरण
                        </span>
                        <button 
                          style={{
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)'; }}
                          onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; }}
                        >
                          <Download size={12} />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Photo */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <Image size={20} color="white" />
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        margin: 0 
                      }}>
                        सर्टिफिकेट फ़ोटो
                      </h3>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <img 
                        src={selectedStudentPhotos.photos.certificate_photo}
                        alt="Certificate Photo"
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}
                      />
                      <div style={{ 
                        marginTop: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#64748b',
                          fontWeight: 500
                        }}>
                          उपलब्धि प्रमाणपत्र
                        </span>
                        <button 
                          style={{
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)'; }}
                          onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; }}
                        >
                          <Download size={12} />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Latest Plant Photo */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <Image size={20} color="white" />
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        margin: 0 
                      }}>
                        लेटेस्ट प्लांट फ़ोटो
                      </h3>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <img 
                        src={selectedStudentPhotos.photos.plant_photo}
                        alt="Latest Plant Photo"
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}
                      />
                      <div style={{ 
                        marginTop: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#64748b',
                          fontWeight: 500
                        }}>
                          पौधारोपण कार्यक्रम
                        </span>
                        <button 
                          style={{
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)'; }}
                          onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; }}
                        >
                          <Download size={12} />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              
              {/* Footer */}
              <div style={{
                background: '#f8fafc',
                padding: '20px 32px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#64748b',
                  fontWeight: 500
                }}>
                  📸 HarGhar Munga Photo Gallery | Student ID: {selectedStudentPhotos.student.s_id}
                </div>
                <button 
                  onClick={closePhotoModal}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => { e.target.style.background = '#4b5563'; }}
                  onMouseOut={(e) => { e.target.style.background = '#6b7280'; }}
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {showEditModal && editingStudent && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0, 0, 0, 0.7)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000,
            backdropFilter: 'blur(6px)'
          }} onClick={closeEditModal}>
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              maxWidth: '1200px', 
              width: '95%', 
              maxHeight: '95vh', 
              overflow: 'hidden', 
              position: 'relative',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
              border: '2px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column'
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: '24px 32px',
                position: 'relative',
                flexShrink: 0
              }}>
                <button 
                  style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    right: '20px', 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    border: 'none', 
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '20px', 
                    cursor: 'pointer', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }} 
                  onClick={closeEditModal}
                  onMouseOver={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.3)'; }}
                  onMouseOut={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.2)'; }}
                >
                  <X size={20} color="white" />
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px'
                  }}>
                    <Edit size={28} color="white" />
                  </div>
                  <div>
                    <h2 style={{ 
                      fontSize: '24px', 
                      fontWeight: 700, 
                      margin: '0 0 4px 0'
                    }}>
                      स्टूडेंट की जानकारी संपादित करें
                    </h2>
                    <p style={{ 
                      fontSize: '14px', 
                      opacity: 0.9, 
                      margin: 0
                    }}>
                      {editingStudent.s_name} (ID: {editingStudent.s_id}) | Master Student Database
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="edit-form-container" style={{ 
                flex: 1,
                overflowY: 'auto', 
                padding: '0',
                scrollBehavior: 'smooth',
                minHeight: 0
              }}>
                <form onSubmit={handleEditSubmit} style={{ padding: '32px' }}>
                  
                  {/* Basic Information Section */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 700, 
                      color: '#1e293b', 
                      margin: '0 0 20px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderBottom: '2px solid #f1f5f9',
                      paddingBottom: '10px'
                    }}>
                      <User size={20} color="#1e293b" />
                      व्यक्तिगत जानकारी
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                      
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '14px' 
                        }}>
                          बच्चे का नाम *
                        </label>
                        <input
                          type="text"
                          name="s_name"
                          value={editFormData.s_name || ''}
                          onChange={handleEditFormChange}
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxSizing: 'border-box',
                            background: 'white',
                            color: '#1e293b',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '14px' 
                        }}>
                          मोबाइल नंबर
                        </label>
                        <input
                          type="number"
                          name="s_mobile"
                          value={editFormData.s_mobile || ''}
                          onChange={handleEditFormChange}
                          maxLength="10"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxSizing: 'border-box',
                            background: 'white',
                            color: '#1e293b',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '14px' 
                        }}>
                          पिता का नाम
                        </label>
                        <input
                          type="text"
                          name="s_father"
                          value={editFormData.s_father || ''}
                          onChange={handleEditFormChange}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxSizing: 'border-box',
                            background: 'white',
                            color: '#1e293b',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '14px' 
                        }}>
                          माता का नाम
                        </label>
                        <input
                          type="text"
                          name="s_mother"
                          value={editFormData.s_mother || ''}
                          onChange={handleEditFormChange}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxSizing: 'border-box',
                            background: 'white',
                            color: '#1e293b',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '14px' 
                        }}>
                          जन्म तिथि
                        </label>
                        <input
                          type="date"
                          name="s_dob"
                          value={editFormData.s_dob || ''}
                          onChange={handleEditFormChange}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxSizing: 'border-box',
                            background: 'white',
                            color: '#1e293b',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '14px' 
                        }}>
                          उम्र (साल)
                        </label>
                        <input
                          type="number"
                          name="s_age"
                          value={editFormData.s_age || ''}
                          onChange={handleEditFormChange}
                          min="0"
                          max="18"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxSizing: 'border-box',
                            background: 'white',
                            color: '#1e293b',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>

                    </div>
                  </div>

                  {/* Physical Information Section */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 700, 
                      color: '#1e293b', 
                      margin: '0 0 20px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderBottom: '2px solid #f1f5f9',
                      paddingBottom: '10px'
                    }}>
                      <Activity size={20} color="#1e293b" />
                      शारीरिक विवरण
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                      
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '14px' 
                        }}>
                          कद (Height)
                        </label>
                        <input
                          type="text"
                          name="s_height"
                          value={editFormData.s_height || ''}
                          onChange={handleEditFormChange}
                          placeholder="उदाहरण: 95 cm"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxSizing: 'border-box',
                            background: 'white',
                            color: '#1e293b',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '14px' 
                        }}>
                          वजन (Weight)
                        </label>
                        <input
                          type="text"
                          name="s_weight"
                          value={editFormData.s_weight || ''}
                          onChange={handleEditFormChange}
                          placeholder="उदाहरण: 14.5 kg"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxSizing: 'border-box',
                            background: 'white',
                            color: '#1e293b',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '14px' 
                        }}>
                          स्वास्थ्य स्थिति *
                        </label>
                        <select
                          name="s_healtha_status"
                          value={editFormData.s_healtha_status || ''}
                          onChange={handleEditFormChange}
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxSizing: 'border-box',
                            background: 'white',
                            color: '#1e293b',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        >
                          <option value="">स्वास्थ्य स्थिति चुनें</option>
                          {healthStatusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* Project & Location Section */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 700, 
                      color: '#1e293b', 
                      margin: '0 0 20px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderBottom: '2px solid #f1f5f9',
                      paddingBottom: '10px'
                    }}>
                      <Building size={20} color="#1e293b" />
                      परियोजना एवं स्थान की जानकारी
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                      
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '14px' 
                        }}>
                          परियोजना *
                        </label>
                        <select
                          name="sp_id"
                          value={editFormData.sp_id || ''}
                          onChange={handleEditFormChange}
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxSizing: 'border-box',
                            background: 'white',
                            color: '#1e293b',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        >
                          <option value="">परियोजना चुनें</option>
                          {pariyojnaOptions.map(pariyojna => (
                            <option key={pariyojna.p_id} value={pariyojna.p_id}>
                              {pariyojna.p_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '14px' 
                        }}>
                          सेक्टर *
                        </label>
                        <select
                          name="ss_id"
                          value={editFormData.ss_id || ''}
                          onChange={handleEditFormChange}
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxSizing: 'border-box',
                            background: 'white',
                            color: '#1e293b',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        >
                          <option value="">सेक्टर चुनें</option>
                          {getFilteredSectors(editFormData.sp_id).map(sector => (
                            <option key={sector.s_id} value={sector.s_id}>
                              {sector.s_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '14px' 
                        }}>
                          केंद्र *
                        </label>
                        <select
                          name="sk_id"
                          value={editFormData.sk_id || ''}
                          onChange={handleEditFormChange}
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxSizing: 'border-box',
                            background: 'white',
                            color: '#1e293b',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        >
                          <option value="">केंद्र चुनें</option>
                          {getFilteredKendras(editFormData.ss_id, editFormData.sp_id).map(kendra => (
                            <option key={kendra.k_id} value={kendra.k_id}>
                              {kendra.k_name}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* Address Section */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 700, 
                      color: '#1e293b', 
                      margin: '0 0 20px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderBottom: '2px solid #f1f5f9',
                      paddingBottom: '10px'
                    }}>
                      <MapPin size={20} color="#1e293b" />
                      पता
                    </h3>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: 600, 
                        color: '#1e293b', 
                        fontSize: '14px' 
                      }}>
                        संपूर्ण पता
                      </label>
                      <textarea
                        name="s_address"
                        value={editFormData.s_address || ''}
                        onChange={handleEditFormChange}
                        rows="3"
                        placeholder="पूरा पता लिखें..."
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '2px solid #e2e8f0',
                          fontSize: '14px',
                          fontWeight: '500',
                          boxSizing: 'border-box',
                          background: 'white',
                          color: '#1e293b',
                          transition: 'all 0.3s ease',
                          resize: 'vertical',
                          minHeight: '80px'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  </div>

                </form>
                
                {/* Custom Scrollbar Styles */}
                <style>{`
                  .edit-form-container::-webkit-scrollbar {
                    width: 8px;
                  }
                  .edit-form-container::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                  }
                  .edit-form-container::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    border-radius: 10px;
                  }
                  .edit-form-container::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #d97706, #b45309);
                  }
                `}</style>
              </div>
              
              {/* Footer with Action Buttons */}
              <div style={{
                background: '#f8fafc',
                padding: '20px 32px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                flexShrink: 0
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#64748b',
                  fontWeight: 500
                }}>
                  ⚠️ सभी आवश्यक फ़ील्ड (*) भरना अनिवार्य है
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="button"
                    onClick={closeEditModal}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => { e.target.style.background = '#4b5563'; }}
                    onMouseOut={(e) => { e.target.style.background = '#6b7280'; }}
                  >
                    रद्द करें
                  </button>
                  <button 
                    type="submit"
                    onClick={handleEditSubmit}
                    style={{
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => { 
                      e.target.style.transform = 'translateY(-1px)'; 
                      e.target.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.4)';
                    }}
                    onMouseOut={(e) => { 
                      e.target.style.transform = 'translateY(0)'; 
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    💾 सेव करें
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentStats;
