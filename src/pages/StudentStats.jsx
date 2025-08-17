import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import InfoBox from '../components/InfoBox';
import { Search, Eye, Edit, Baby, X, Phone, User, Weight, Building, AlertTriangle, FileText, Scale, MapPin, Ruler, Calendar, Activity, Hospital, Home, Camera, Image, Download, RotateCcw } from 'lucide-react';
import serverURL from './server';
import '../styles/unified.css';

const StudentStats = ({ onLogout }) => {
  const [filters, setFilters] = useState({
    sp_id: '',
    ss_id: '',
    sk_id: '',
    s_healtha_status: '',
    s_age: ''
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedStudentPhotos, setSelectedStudentPhotos] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // API State
  const [students, setStudents] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    pariyojna: [],
    sector: [],
    kendra: [],
    health_status: []
  });
  const [stats, setStats] = useState({
    total_students: 0,
    healthy_students: 0,
    weak_students: 0,
    active_records: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);

  // Search debouncing
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchFilterOptions();
    fetchStudents();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchStats();
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, searchTerm]);

  // Debounce search input
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500); // 500ms delay

    return () => clearTimeout(delayedSearch);
  }, [searchInput]);

  // API Functions
  const fetchFilterOptions = async () => {
    try {
      const response = await fetch(`${serverURL}hgm_student_web.php?action=get_filters`);
      
      // Check if response is ok and content-type is JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setFilterOptions(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error fetching filter options: ' + err.message);
      console.error('Filter fetch error:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        action: 'get_students',
        ...filters,
        search: searchTerm
      });
      
      const response = await fetch(`${serverURL}hgm_student_web.php?${params}`);
      
      // Check if response is ok and content-type is JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStudents(result.data);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error fetching students: ' + err.message);
      console.error('Students fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams({
        action: 'get_stats',
        ...filters,
        search: searchTerm
      });
      
      const response = await fetch(`${serverURL}hgm_student_web.php?${params}`);
      
      // Check if response is ok and content-type is JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        console.error('Error fetching stats:', result.message);
      }
    } catch (err) {
      console.error('Error fetching stats:', err.message);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await fetch(`${serverURL}hgm_student_web.php?action=get_student_details&student_id=${studentId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Student details fetch error:', err);
      throw err;
    }
  };

  const fetchStudentPhotos = async (studentId) => {
    try {
      const response = await fetch(`${serverURL}hgm_student_web.php?action=get_student_photos&student_id=${studentId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Student photos fetch error:', err);
      throw err;
    }
  };

  const updateStudent = async (studentData) => {
    try {
      const response = await fetch(`${serverURL}hgm_student_web.php?action=update_student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData)
      });
      
      // Check if response is ok and content-type is JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
      
      const result = await response.json();
      
      if (result.success) {
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Student update error:', err);
      throw err;
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const clearAllFilters = () => {
    setFilters({
      sp_id: '',
      ss_id: '',
      sk_id: '',
      s_healtha_status: '',
      s_age: ''
    });
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchFilterOptions(),
        fetchStudents(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update info box data to use API stats
  const infoBoxData = [
    {
      title: 'कुल बच्चे',
      count: stats.total_students?.toString() || '0',
      icon: <User size={24} />,
      color: 'blue'
    },
    {
      title: 'स्वस्थ बच्चे',
      count: stats.healthy_students?.toString() || '0',
      icon: <Activity size={24} />,
      color: 'green'
    },
    {
      title: 'कमज़ोर बच्चे',
      count: stats.weak_students?.toString() || '0',
      icon: <AlertTriangle size={24} />,
      color: 'brown'
    },
    {
      title: 'सक्रिय रिकॉर्ड',
      count: stats.active_records?.toString() || '0',
      icon: <FileText size={24} />,
      color: 'light-brown'
    }
  ];

  const openModal = async (student) => {
    try {
      const detailedStudent = await fetchStudentDetails(student.s_id);
      setSelectedStudent(detailedStudent);
      setShowModal(true);
    } catch (err) {
      alert('Error loading student details: ' + err.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const openPhotoModal = async (student) => {
    try {
      const photos = await fetchStudentPhotos(student.s_id);
      setSelectedStudentPhotos({
        student,
        photos
      });
      setShowPhotoModal(true);
    } catch (err) {
      alert('Error loading student photos: ' + err.message);
    }
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedStudentPhotos(null);
  };

  const openEditModal = async (student) => {
    try {
      const detailedStudent = await fetchStudentDetails(student.s_id);
      setEditingStudent(detailedStudent);
      setEditFormData(detailedStudent);
      setShowEditModal(true);
    } catch (err) {
      alert('Error loading student for editing: ' + err.message);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingStudent(null);
    setEditFormData({});
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(editFormData);
      alert('छात्र की जानकारी सफलतापूर्वक अपडेट की गई');
      closeEditModal();
      fetchStudents(); // Refresh the student list
    } catch (err) {
      alert('Error updating student: ' + err.message);
    }
  };

  // Filter functions for dropdowns
  const getFilteredSectors = (selectedPariyojnaId) => {
    if (!selectedPariyojnaId || !filterOptions.sector) return filterOptions.sector;
    return filterOptions.sector.filter(sector => sector.sp_id == selectedPariyojnaId);
  };

  const getFilteredKendras = (selectedSectorId, selectedPariyojnaId) => {
    if (!filterOptions.kendra) return [];
    
    let filtered = filterOptions.kendra;
    
    if (selectedSectorId) {
      filtered = filtered.filter(kendra => kendra.ks_id == selectedSectorId);
    }
    
    if (selectedPariyojnaId) {
      filtered = filtered.filter(kendra => kendra.kp_id == selectedPariyojnaId);
    }
    
    return filtered;
  };

  const getHealthStatusColor = (status) => {
    switch(status) {
      case 'healthy': return '#10b981';
      case 'weak': return '#f59e0b';
      case 'sick': return '#ef4444';
      case 'normal': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getHealthStatusBg = (status) => {
    switch(status) {
      case 'healthy': return '#ecfdf5';
      case 'weak': return '#fef3c7';
      case 'sick': return '#fee2e2';
      case 'normal': return '#dbeafe';
      default: return '#f3f4f6';
    }
  };

  const getHealthStatusLabel = (status) => {
    switch(status) {
      case 'healthy': return 'स्वस्थ';
      case 'weak': return 'कमज़ोर';
      case 'sick': return 'बीमार';
      case 'normal': return 'सामान्य';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="student-stats-container">
        <Sidebar onLogout={onLogout} />
        <main className="student-stats-main">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ fontSize: '18px', color: '#64748b' }}>
              Loading student data...
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-stats-container">
        <Sidebar onLogout={onLogout} />
        <main className="student-stats-main">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ fontSize: '18px', color: '#ef4444' }}>
              Error: {error}
            </div>
            <button 
              onClick={() => {
                setError(null);
                fetchStudents();
                fetchFilterOptions();
                fetchStats();
              }}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Apply filters and search to students
  const filteredStudents = students.filter(student => {
    // Search filter
    const matchesSearch = !searchTerm || 
      student.s_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.s_father?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.s_id?.toString().includes(searchTerm);

    // Dropdown filters
    const matchesPariyojna = !filters.sp_id || student.sp_id?.toString() === filters.sp_id;
    const matchesSector = !filters.ss_id || student.ss_id?.toString() === filters.ss_id;
    const matchesKendra = !filters.sk_id || student.sk_id?.toString() === filters.sk_id;
    const matchesHealth = !filters.s_healtha_status || student.s_healtha_status === filters.s_healtha_status;
    const matchesAge = !filters.s_age || student.s_age?.toString() === filters.s_age;

    return matchesSearch && matchesPariyojna && matchesSector && matchesKendra && matchesHealth && matchesAge;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <div className="student-stats-status-container">
              <button 
                onClick={refreshData}
                className="refresh-btn"
                disabled={loading}
                title="पूरे डेटा को रीफ्रेश करें"
                style={{
                  background: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginRight: '16px',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.background = '#15803d';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#16a34a';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <RotateCcw className={`w-4 h-4 ${loading ? 'spin' : ''}`} />
                {loading ? 'रीफ्रेश हो रहा है...' : 'रीफ्रेश करें'}
              </button>
              <div className="student-stats-status">
                <span className="student-status-dot">●</span>
                Live Data
              </div>
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
                value={searchInput}
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
                {filterOptions.pariyojna?.map(pariyojna => (
                  <option key={pariyojna.p_id} value={pariyojna.p_id}>
                    {pariyojna.p_name}
                  </option>
                ))}
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
                {getFilteredSectors(filters.sp_id)?.map(sector => (
                  <option key={sector.s_id} value={sector.s_id}>
                    {sector.s_name}
                  </option>
                ))}
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
                {getFilteredKendras(filters.ss_id, filters.sp_id)?.map(kendra => (
                  <option key={kendra.k_id} value={kendra.k_id}>
                    {kendra.k_name}
                  </option>
                ))}
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
                {filterOptions.health_status?.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
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

            {/* Clear Filters Button */}
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button
                onClick={clearAllFilters}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #ef4444',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#dc2626';
                  e.target.style.borderColor = '#dc2626';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#ef4444';
                  e.target.style.borderColor = '#ef4444';
                }}
              >
                <X size={16} />
                फ़िल्टर साफ़ करें
              </button>
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
                पेज {currentPage} - {currentStudents.length} बच्चे (कुल {filteredStudents.length})
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
                  {currentStudents.map((student, index) => (
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
                          {getHealthStatusLabel(student.s_healtha_status)}
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

          {/* Pagination */}
          {filteredStudents.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '32px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0'
            }}>
              {/* Pagination Info */}
              <div style={{
                fontSize: '14px',
                color: '#64748b',
                fontWeight: 500
              }}>
                कुल {filteredStudents.length} में से {indexOfFirstStudent + 1}-{Math.min(indexOfLastStudent, filteredStudents.length)} दिखाए गए
              </div>

              {/* Pagination Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: currentPage === 1 ? '#f8fafc' : 'white',
                    color: currentPage === 1 ? '#94a3b8' : '#475569',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  पिछला
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => {
                  // Show only 5 pages around current page
                  if (pageNumber === 1 || pageNumber === totalPages || 
                      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: pageNumber === currentPage ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                          backgroundColor: pageNumber === currentPage ? '#3b82f6' : 'white',
                          color: pageNumber === currentPage ? 'white' : '#475569',
                          fontSize: '14px',
                          fontWeight: pageNumber === currentPage ? 600 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          minWidth: '36px'
                        }}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
                    return (
                      <span key={pageNumber} style={{ color: '#94a3b8', fontSize: '14px' }}>
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: currentPage === totalPages ? '#f8fafc' : 'white',
                    color: currentPage === totalPages ? '#94a3b8' : '#475569',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  अगला
                </button>
              </div>
            </div>
          )}
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
                        }}>{getHealthStatusLabel(selectedStudent.s_healtha_status)}</span>
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
                      {selectedStudentPhotos.photos.distribution ? (
                        <>
                          <img 
                            src={`${serverURL}${selectedStudentPhotos.photos.distribution.photo_url}`}
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
                              पोषण आहार वितरण - {new Date(selectedStudentPhotos.photos.distribution.created_at).toLocaleDateString('hi-IN')}
                            </span>
                            <button 
                              onClick={() => window.open(`${serverURL}${selectedStudentPhotos.photos.distribution.photo_url}`, '_blank')}
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
                        </>
                      ) : (
                        <div style={{
                          height: '200px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '8px',
                          color: '#64748b'
                        }}>
                          कोई डिस्ट्रिब्यूशन फ़ोटो उपलब्ध नहीं
                        </div>
                      )}
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
                      {selectedStudentPhotos.photos.certificate ? (
                        <>
                          <img 
                            src={`${serverURL}${selectedStudentPhotos.photos.certificate.photo_url}`}
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
                              उपलब्धि प्रमाणपत्र - {new Date(selectedStudentPhotos.photos.certificate.created_at).toLocaleDateString('hi-IN')}
                            </span>
                            <button 
                              onClick={() => window.open(`${serverURL}${selectedStudentPhotos.photos.certificate.photo_url}`, '_blank')}
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
                        </>
                      ) : (
                        <div style={{
                          height: '200px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '8px',
                          color: '#64748b'
                        }}>
                          कोई सर्टिफिकेट फ़ोटो उपलब्ध नहीं
                        </div>
                      )}
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
                      {selectedStudentPhotos.photos.latest_uploads && selectedStudentPhotos.photos.latest_uploads.length > 0 ? (
                        <div style={{ display: 'grid', gap: '12px' }}>
                          {selectedStudentPhotos.photos.latest_uploads.slice(0, 3).map((photo, index) => (
                            <div key={index} style={{ 
                              display: 'flex', 
                              gap: '12px',
                              padding: '8px',
                              backgroundColor: '#f8fafc',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0'
                            }}>
                              <img 
                                src={`${serverURL}${photo.photo_url}`}
                                alt={`Plant Photo ${index + 1}`}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0'
                                }}
                              />
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>
                                    प्लांट फ़ोटो #{index + 1}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                                    {new Date(photo.created_at).toLocaleDateString('hi-IN')}
                                  </div>
                                </div>
                                <button 
                                  onClick={() => window.open(`${serverURL}${photo.photo_url}`, '_blank')}
                                  style={{
                                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    alignSelf: 'flex-start'
                                  }}
                                >
                                  <Download size={10} />
                                  View
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{
                          height: '200px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '8px',
                          color: '#64748b'
                        }}>
                          कोई प्लांट फ़ोटो उपलब्ध नहीं
                        </div>
                      )}
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
                          {filterOptions.health_status?.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
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
                          {filterOptions.pariyojna?.map(pariyojna => (
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
