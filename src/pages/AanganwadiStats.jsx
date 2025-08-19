import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import InfoBox from '../components/InfoBox';
import { Search, Plus, Eye, Edit, Building2, MapPin, User, Users, Phone, Calendar, Check, AlertCircle, X, BarChart3, RotateCcw, Download, Lock, Camera } from 'lucide-react';
import * as XLSX from 'xlsx';
import '../styles/unified.css';
import serverURL from './server';

const AanganwadiStats = ({ onLogout }) => {
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    kp_id: '',
    ks_id: ''
  });

  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedKendra, setSelectedKendra] = useState(null);
  const [kendraPhotos, setKendraPhotos] = useState([]);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [kendras, setKendras] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalKendras: 0,
    activeKendras: 0,
    totalStudents: 0,
    activeStudents: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [masterData, setMasterData] = useState({
    pariyojnas: [],
    sectors: []
  });
  const [filteredSectors, setFilteredSectors] = useState([]);
  const [newKendra, setNewKendra] = useState({
    kp_id: '',
    ks_id: '',
    k_name: '',
    k_address: '',
    login_id: '',
    password: ''
  });
  const [editKendra, setEditKendra] = useState({
    k_id: '',
    k_name: '',
    k_address: '',
    ks_id: '',
    kp_id: '',
    login_id: '',
    password: ''
  });

  // Fetch kendras from API
  const fetchKendras = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add pagination parameters
      params.append('page', pagination.currentPage);
      params.append('limit', pagination.itemsPerPage);
      
      // Add filters
      if (filters.kp_id) params.append('kp_id', filters.kp_id);
      if (filters.ks_id) params.append('ks_id', filters.ks_id);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const response = await fetch(`${serverURL}api_kendras.php?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setKendras(data.data);
        
        // Update pagination from server response
        if (data.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            totalItems: data.pagination.totalItems,
            itemsPerPage: data.pagination.itemsPerPage
          }));
        } else {
          // Fallback for backward compatibility
          setPagination(prev => ({
            ...prev,
            totalItems: data.count || 0,
            totalPages: Math.ceil((data.count || 0) / prev.itemsPerPage)
          }));
        }
      } else {
        console.error('Error fetching kendras:', data.error);
        alert('❌ डेटा लोड करने में समस्या: ' + data.error);
        setKendras([]);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('❌ नेटवर्क एरर: ' + error.message);
      setKendras([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch total statistics for all filtered data (using dedicated stats API)
  const fetchTotalStats = async () => {
    try {
      const params = new URLSearchParams();
      params.append('action', 'get_stats');
      
      // Add filters
      if (filters.kp_id) params.append('kp_id', filters.kp_id);
      if (filters.ks_id) params.append('ks_id', filters.ks_id);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const response = await fetch(`${serverURL}api_kendras.php?${params}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setTotalStats({
          totalKendras: data.data.totalKendras || 0,
          activeKendras: data.data.activeKendras || 0,
          totalStudents: data.data.totalStudents || 0,
          activeStudents: data.data.activeStudents || 0
        });
      } else {
        console.error('Error fetching total stats:', data.message || 'Unknown error');
        // Set default values if API fails
        setTotalStats({
          totalKendras: 0,
          activeKendras: 0,
          totalStudents: 0,
          activeStudents: 0
        });
      }
    } catch (error) {
      console.error('Error fetching total stats:', error);
      // Set default values if fetch fails
      setTotalStats({
        totalKendras: 0,
        activeKendras: 0,
        totalStudents: 0,
        activeStudents: 0
      });
    }
  };

  // Fetch master data for dropdowns
  const fetchMasterData = async () => {
    try {
      const response = await fetch(`${serverURL}api_kendras.php?action=master_data`);
      const data = await response.json();
      
      if (data.success) {
        setMasterData({
          pariyojnas: data.pariyojnas,
          sectors: data.sectors
        });
        console.log('Master data loaded:');
        console.log('Pariyojnas:', data.pariyojnas);
        console.log('Sectors:', data.sectors);
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  };

  // Fetch kendra plant photos
  const fetchKendraPhotos = async (kendraId) => {
    setPhotoLoading(true);
    try {
      const response = await fetch(`${serverURL}kendra_photo_web.php?action=get_kendra_photos&k_id=${kendraId}`);
      const data = await response.json();
      
      console.log('Photo API Response:', data); // Debug log
      
      if (data.success) {
        // data.data contains the response from PHP sendSuccess function
        setKendraPhotos(data.data.photos || []);
        console.log('Photos set:', data.data.photos);
      } else {
        setKendraPhotos([]);
        console.error('Error fetching photos:', data.message || data.error);
      }
    } catch (error) {
      console.error('Error fetching kendra photos:', error);
      setKendraPhotos([]);
    } finally {
      setPhotoLoading(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    // Reset to first page when filters change
    if (pagination.currentPage !== 1) {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    } else {
      fetchKendras();
      fetchTotalStats();
    }
  }, [filters, searchTerm]);

  // Fetch data when page changes
  useEffect(() => {
    fetchKendras();
    fetchTotalStats();
  }, [pagination.currentPage]);

  useEffect(() => {
    fetchMasterData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // If pariyojna changes, reset sector selection
    if (name === 'kp_id') {
      setFilters(prev => ({
        ...prev,
        [name]: value,
        ks_id: '' // Reset sector when pariyojna changes
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Reset to first page when filter changes
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Pagination functions
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newSize,
      currentPage: 1
    }));
  };

  const filteredKendras = kendras; // Already filtered by API

  const infoBoxData = [
    {
      title: 'कुल केंद्र',
      count: totalStats.totalKendras.toString(),
      icon: <Building2 size={24} />,
      color: 'blue'
    },
    {
      title: 'सक्रिय केंद्र',
      count: totalStats.activeKendras.toString(),
      icon: <Check size={24} />,
      color: 'green'
    },
    {
      title: 'कुल छात्र',
      count: totalStats.totalStudents.toString(),
      icon: <User size={24} />,
      color: 'brown'
    },
    {
      title: 'सक्रिय छात्र',
      count: totalStats.activeStudents.toString(),
      icon: <BarChart3 size={24} />,
      color: 'light-brown'
    }
  ];

  const handleAddKendra = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${serverURL}api_kendras.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newKendra)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('✅ केंद्र सफलतापूर्वक जोड़ा गया!');
        resetForm();
        setShowAddModal(false);
        fetchKendras(); // Refresh data
      } else {
        alert('❌ एरर: ' + data.error);
      }
    } catch (error) {
      alert('❌ नेटवर्क एरर: ' + error.message);
    }
  };

  const getPariyojnaName = (kp_id) => {
    const pariyojna = masterData.pariyojnas.find(p => p.p_id === parseInt(kp_id));
    return pariyojna ? pariyojna.p_name : 'अज्ञात कार्यक्रम';
  };

  const getSectorName = (ks_id) => {
    const sector = masterData.sectors.find(s => s.s_id === parseInt(ks_id));
    return sector ? sector.s_name : 'अज्ञात सेक्टर';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setNewKendra({
      ...newKendra,
      [name]: value,
      // Reset sector when pariyojna changes
      ...(name === 'kp_id' && { ks_id: '' })
    });

    // Filter sectors based on selected pariyojna
    if (name === 'kp_id') {
      if (value) {
        const filtered = masterData.sectors.filter(sector => 
          sector.sp_id === parseInt(value)
        );
        setFilteredSectors(filtered);
        console.log('Selected pariyojna ID:', value);
        console.log('Available sectors:', masterData.sectors);
        console.log('Filtered sectors:', filtered);
      } else {
        // Clear sectors when no pariyojna is selected
        setFilteredSectors([]);
        console.log('Pariyojna cleared, sectors reset');
      }
    }
  };

  // Reset form and filtered sectors
  const resetForm = () => {
    setNewKendra({
      kp_id: '',
      ks_id: '',
      k_name: '',
      k_address: '',
      login_id: '',
      password: ''
    });
    setFilteredSectors([]);
  };

  const handleEditInputChange = (e) => {
    setEditKendra({
      ...editKendra,
      [e.target.name]: e.target.value
    });
  };

  const handleEditKendra = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${serverURL}api_kendras.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editKendra)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('✅ केंद्र सफलतापूर्वक अपडेट हुआ!');
        setShowEditModal(false);
        setEditKendra({
          k_id: '',
          k_name: '',
          k_address: '',
          ks_id: '',
          kp_id: '',
          login_id: '',
          password: ''
        });
        fetchKendras(); // Refresh data
      } else {
        alert('❌ एरर: ' + data.error);
      }
    } catch (error) {
      alert('❌ नेटवर्क एरर: ' + error.message);
    }
  };

  const navigateToStudents = (kendra) => {
    // Store kendra details in localStorage for StudentStats to pick up
    const kendraData = {
      k_id: kendra.k_id,
      k_name: kendra.k_name,
      sp_id: kendra.kp_id.toString(),  // Ensure string format
      ss_id: kendra.ks_id.toString(),  // Ensure string format  
      sk_id: kendra.k_id.toString()    // Ensure string format
    };
    console.log('Storing kendra data for navigation:', kendraData);
    console.log('Original kendra object:', kendra);
    localStorage.setItem('selectedKendra', JSON.stringify(kendraData));
    
    // Navigate to StudentStats using React Router
    navigate('/student-stats');
    setShowDetailModal(false);
  };

  const handleOpenPhotoModal = async (kendra) => {
    setSelectedKendra(kendra);
    setShowPhotoModal(true);
    await fetchKendraPhotos(kendra.k_id);
  };

  const handleClosePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedKendra(null);
    setKendraPhotos([]);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchMasterData(),
        fetchKendras(),
        fetchTotalStats()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Excel Export Function
  const exportToExcel = async () => {
    try {
      // Show loading state
      const exportBtn = document.querySelector('.export-btn');
      if (exportBtn) {
        exportBtn.textContent = 'Exporting...';
        exportBtn.disabled = true;
      }

      // First, get total count for filtered data
      const statsParams = new URLSearchParams();
      statsParams.append('action', 'get_stats');
      if (filters.kp_id) statsParams.append('kp_id', filters.kp_id);
      if (filters.ks_id) statsParams.append('ks_id', filters.ks_id);
      if (searchTerm.trim()) statsParams.append('search', searchTerm.trim());

      const statsResponse = await fetch(`${serverURL}api_kendras.php?${statsParams}`);
      const statsData = await statsResponse.json();
      
      if (!statsData.success) {
        throw new Error('Failed to get total count');
      }

      const totalRecords = statsData.data.totalKendras;
      
      if (totalRecords === 0) {
        alert('⚠️ No data found to export');
        return;
      }

      // Now fetch all pages of data
      let allKendras = [];
      let currentPage = 1;
      const limitPerPage = 100; // API maximum
      const totalPages = Math.ceil(totalRecords / limitPerPage);

      // Show progress in button text
      for (let page = 1; page <= totalPages; page++) {
        if (exportBtn) {
          exportBtn.textContent = `Exporting... ${page}/${totalPages}`;
        }

        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limitPerPage);
        
        // Apply same filters as current view
        if (filters.kp_id) params.append('kp_id', filters.kp_id);
        if (filters.ks_id) params.append('ks_id', filters.ks_id);
        if (searchTerm.trim()) params.append('search', searchTerm.trim());

        const response = await fetch(`${serverURL}api_kendras.php?${params}`);
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch export data');
        }

        const pageData = data.data || [];
        allKendras = [...allKendras, ...pageData];
        
        // If we got fewer records than expected, we've reached the end
        if (pageData.length < limitPerPage && page < totalPages) {
          break;
        }
      }

      // Prepare data for export with Hindi headers
      const exportData = allKendras.map((kendra, index) => ({
        'क्रम संख्या': index + 1,
        'केंद्र ID': kendra.k_id || 'N/A',
        'केंद्र का नाम': kendra.k_name || 'N/A',
        'केंद्र का पता': kendra.k_address || 'N/A',
        'परियोजना': getPariyojnaName(kendra.kp_id) || 'N/A',
        'सेक्टर': getSectorName(kendra.ks_id) || 'N/A',
        'लॉगिन ID': kendra.login_id || 'N/A',
        'कुल छात्र': kendra.total_students || 0,
        'सक्रिय छात्र': kendra.active_students || 0,
        'छात्र गतिविधि %': kendra.total_students > 0 ? 
          Math.round((kendra.active_students / kendra.total_students) * 100) + '%' : '0%',
        'स्थिति': kendra.active_students > 0 ? 'सक्रिय' : 'निष्क्रिय'
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths for better visibility
      const columnWidths = [
        { wch: 8 },   // क्रम संख्या
        { wch: 10 },  // केंद्र ID
        { wch: 25 },  // केंद्र का नाम
        { wch: 40 },  // केंद्र का पता
        { wch: 20 },  // परियोजना
        { wch: 15 },  // सेक्टर
        { wch: 15 },  // लॉगिन ID
        { wch: 12 },  // कुल छात्र
        { wch: 12 },  // सक्रिय छात्र
        { wch: 15 },  // छात्र गतिविधि %
        { wch: 12 },  // स्थिति
        { wch: 15 },  // रिकॉर्ड तारीख
        { wch: 15 }   // अपडेट तारीख
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Kendra Data');

      // Generate filename with current date and filters
      const currentDate = new Date().toLocaleDateString('hi-IN').replace(/\//g, '-');
      const activeFilters = [];
      if (filters.kp_id) activeFilters.push('Project');
      if (filters.ks_id) activeFilters.push('Sector');
      if (searchTerm) activeFilters.push('Search');
      
      const filterText = activeFilters.length > 0 ? `_Filtered_${activeFilters.join('_')}` : '_All';
      const filename = `HarGhar_Kendras_${currentDate}${filterText}.xlsx`;

      // Export file
      XLSX.writeFile(workbook, filename);

      // Show success message with detailed info
      alert(`✅ Excel file exported successfully!\n📁 File: ${filename}\n📊 Total Records: ${allKendras.length}\n🔍 Applied Filters: ${activeFilters.length > 0 ? activeFilters.join(', ') : 'None'}`);

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('❌ Error exporting to Excel. Please try again.');
    } finally {
      // Restore button state
      const exportBtn = document.querySelector('.export-btn');
      if (exportBtn) {
        exportBtn.textContent = `Excel Export (${filteredKendras.length})`;
        exportBtn.disabled = loading || filteredKendras.length === 0;
      }
    }
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
    <div className="aanganwadi-stats-container">
      <Sidebar onLogout={onLogout} />
      
      <main className="aanganwadi-stats-main">
        {/* Government Header */}
        <div className="aanganwadi-stats-header">
          <div className="student-stats-header-content">
            <div>
              <h1 className="student-stats-title">
                छत्तीसगढ़ शासन | Kendra Management System
              </h1>
              <p className="student-stats-subtitle">
                HarGhar Munga Project - Kendra Centers Portal
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
                  marginRight: '12px',
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

              <button 
                onClick={exportToExcel}
                className="export-btn"
                disabled={loading || filteredKendras.length === 0}
                title={`${filteredKendras.length} केंद्र रिकॉर्ड्स को Excel में एक्सपोर्ट करें`}
                style={{
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  cursor: (loading || filteredKendras.length === 0) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginRight: '16px',
                  transition: 'all 0.3s ease',
                  opacity: (loading || filteredKendras.length === 0) ? 0.5 : 1,
                  boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!loading && filteredKendras.length > 0) {
                    e.target.style.background = 'linear-gradient(135deg, #047857, #059669)';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #059669, #10b981)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(5, 150, 105, 0.3)';
                }}
              >
                <Download className="w-4 h-4" />
                Excel Export
              </button>
              <div className="student-stats-status">
                <span className="student-status-dot">●</span>
                Live Database
              </div>
            </div>
          </div>
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
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                <Search size={20} color="white" />
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
                background: 'linear-gradient(135deg, #22c55e, #16a34a)', 
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} />
                नया केंद्र जोड़ें
              </div>
            </button>
          </div>
          
          {/* Search Bar with Button */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="केंद्र का नाम, पता, परियोजना, सेक्टर या लॉगिन ID से खोजें..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setSearchTerm(searchInput.trim());
                      setPagination(prev => ({ ...prev, currentPage: 1 }));
                    }
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '16px 24px', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '12px', 
                    fontSize: '16px', 
                    fontWeight: '500',
                    transition: 'all 0.3s ease', 
                    background: 'white', 
                    color: '#1e293b',
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
              </div>
              
              <button
                onClick={() => {
                  setSearchTerm(searchInput.trim());
                  setPagination(prev => ({ ...prev, currentPage: 1 }));
                }}
                style={{
                  padding: '16px 24px',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(5, 150, 105, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
                }}
              >
                <Search size={16} />
                खोजें
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', marginBottom: '20px' }}>
            {/* Filter Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', flex: 1 }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>परियोजना चुनें</label>
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
                  {masterData.pariyojnas.map(pariyojna => (
                    <option key={pariyojna.p_id} value={pariyojna.p_id}>
                      {pariyojna.p_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>सेक्टर चुनें</label>
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
                  {masterData.sectors
                    .filter(sector => !filters.kp_id || sector.sp_id == filters.kp_id)
                    .map(sector => (
                      <option key={sector.s_id} value={sector.s_id}>
                        {sector.s_name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(filters.kp_id || filters.ks_id || searchTerm) && (
              <button
                onClick={() => {
                  setFilters({ kp_id: '', ks_id: '' });
                  setSearchInput('');
                  setSearchTerm('');
                  setPagination(prev => ({ ...prev, currentPage: 1 }));
                }}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(220, 38, 38, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                }}
              >
                <X size={16} />
                फ़िल्टर साफ़ करें
              </button>
            )}
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

        {/* Kendra List */}
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
                <Building2 size={20} color="#ffffff" />
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
          
          {/* Scrollable Table Container */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white',
              padding: '20px',
              fontSize: '16px',
              fontWeight: 700,
              display: 'grid',
              gridTemplateColumns: '60px 1fr 180px 140px 110px 110px 120px 200px',
              gap: '16px',
              alignItems: 'center'
            }}>
              <div>क्रम</div>
              <div>केंद्र का नाम</div>
              <div>विवरण</div>
              <div>परियोजना</div>
              <div>सेक्टर</div>
              <div>छात्र संख्या</div>
              <div>बनाया गया</div>
              <div>कार्य</div>
            </div>

            {/* Scrollable Content */}
            <div style={{
              maxHeight: '600px',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              {loading ? (
                <div style={{ 
                  padding: '60px 40px', 
                  textAlign: 'center',
                  background: 'white'
                }}>
                  <div style={{ 
                    fontSize: '18px', 
                    color: '#1e293b',
                    fontWeight: 600,
                    marginBottom: '16px'
                  }}>
                    <RotateCcw size={16} className="inline-block mr-2" />
                    डेटा लोड हो रहा है...
                  </div>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #e2e8f0',
                    borderTop: '4px solid #22c55e',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto'
                  }}></div>
                </div>
              ) : filteredKendras.length > 0 ? (
                filteredKendras.map((kendra, index) => (
                  <div 
                    key={kendra.k_id} 
                    style={{
                      padding: '20px',
                      borderBottom: index === filteredKendras.length - 1 ? 'none' : '1px solid #e2e8f0',
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr 180px 140px 110px 110px 120px 200px',
                      gap: '16px',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {/* Serial Number Column */}
                    <div style={{
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      textAlign: 'center'
                    }}>
                      {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                    </div>

                    {/* Name Column */}
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#1e293b',
                        marginBottom: '4px',
                        lineHeight: '1.3'
                      }}>
                        {kendra.k_name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#64748b',
                        fontWeight: 500
                      }}>
                        <Lock size={12} className="inline-block mr-1" />
                        {kendra.login_id}
                      </div>
                    </div>

                    {/* Address Column - Format: pariyojna,sector,kendra name */}
                    <div style={{
                      fontSize: '13px',
                      color: '#374151',
                      fontWeight: 500,
                      lineHeight: '1.4',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      <MapPin size={14} className="inline-block mr-1" />
                      {kendra.pariyojna_name},{kendra.sector_name},{kendra.k_name}
                    </div>

                    {/* Project Column */}
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1d4ed8',
                      background: '#eff6ff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      border: '1px solid #bfdbfe'
                    }}>
                      {kendra.pariyojna_name}
                    </div>

                    {/* Sector Column */}
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#dc2626',
                      background: '#fef2f2',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      border: '1px solid #fecaca'
                    }}>
                      {kendra.sector_name}
                    </div>

                    {/* Students Column - Only total count */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#1e293b'
                      }}>
                        {kendra.total_students}
                      </div>
                    </div>

                    {/* Created Date Column */}
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b',
                      fontWeight: 500,
                      textAlign: 'center'
                    }}>
                      <div><Calendar size={12} className="inline-block mr-1" />{new Date(kendra.k_createdAt).toLocaleDateString('hi-IN')}</div>
                      <div style={{ marginTop: '2px', fontSize: '11px' }}>
                        <RotateCcw size={10} className="inline-block mr-1" />{new Date(kendra.k_updatedAt).toLocaleDateString('hi-IN')}
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={() => {
                          setSelectedKendra(kendra);
                          setShowDetailModal(true);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        className="action-btn action-btn-view"
                        title="विवरण देखें"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditKendra({
                            k_id: kendra.k_id,
                            k_name: kendra.k_name,
                            k_address: kendra.k_address,
                            ks_id: kendra.ks_id,
                            kp_id: kendra.kp_id,
                            login_id: kendra.login_id,
                            password: kendra.password
                          });
                          setShowEditModal(true);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        className="action-btn action-btn-edit"
                        title="संपादित करें"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => navigateToStudents(kendra)}
                        style={{
                          background: 'linear-gradient(135deg, #16a34a, #15803d)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        className="action-btn action-btn-student"
                        title="छात्र देखें"
                      >
                        <User size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenPhotoModal(kendra)}
                        style={{
                          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        className="action-btn action-btn-photo"
                        title="पौधों की तस्वीरें देखें"
                      >
                        <Camera size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 40px',
                  color: '#64748b'
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
          
          {/* Pagination Controls */}
          {!loading && kendras.length > 0 && (
            <div style={{ 
              marginTop: '24px', 
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                {/* Page Info */}
                <div style={{ 
                  fontSize: '14px', 
                  color: '#64748b',
                  fontWeight: 500
                }}>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>
                    पृष्ठ {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <span style={{ margin: '0 8px', color: '#cbd5e1' }}>|</span>
                  <span>कुल {pagination.totalItems} केंद्र</span>
                  <span style={{ margin: '0 8px', color: '#cbd5e1' }}>|</span>
                  <span>{kendras.length} दिखाए गए</span>
                </div>

                {/* Page Size Selector */}
                {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                    प्रति पृष्ठ:
                  </span>
                  <select
                    value={pagination.itemsPerPage}
                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                    style={{
                      padding: '6px 12px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      background: 'white',
                      color: '#1e293b',
                      cursor: 'pointer'
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div> */}

                {/* Page Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* First Page */}
                  <button
                    onClick={() => goToPage(1)}
                    disabled={pagination.currentPage === 1}
                    style={{
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: pagination.currentPage === 1 ? 'not-allowed' : 'pointer',
                      background: pagination.currentPage === 1 ? '#f8fafc' : '#22c55e',
                      color: pagination.currentPage === 1 ? '#cbd5e1' : 'white',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ««
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() => goToPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    style={{
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: pagination.currentPage === 1 ? 'not-allowed' : 'pointer',
                      background: pagination.currentPage === 1 ? '#f8fafc' : '#059669',
                      color: pagination.currentPage === 1 ? '#cbd5e1' : 'white',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    « पिछला
                  </button>

                  {/* Page Numbers */}
                  {(() => {
                    const pages = [];
                    const start = Math.max(1, pagination.currentPage - 2);
                    const end = Math.min(pagination.totalPages, pagination.currentPage + 2);
                    
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => goToPage(i)}
                          style={{
                            padding: '8px 12px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: i === pagination.currentPage ? '#3b82f6' : '#f1f5f9',
                            color: i === pagination.currentPage ? 'white' : '#475569',
                            minWidth: '40px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            if (i !== pagination.currentPage) {
                              e.target.style.background = '#e2e8f0';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (i !== pagination.currentPage) {
                              e.target.style.background = '#f1f5f9';
                            }
                          }}
                        >
                          {i}
                        </button>
                      );
                    }
                    return pages;
                  })()}

                  {/* Next Page */}
                  <button
                    onClick={() => goToPage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    style={{
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: pagination.currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
                      background: pagination.currentPage === pagination.totalPages ? '#f8fafc' : '#059669',
                      color: pagination.currentPage === pagination.totalPages ? '#cbd5e1' : 'white',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    अगला »
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => goToPage(pagination.totalPages)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    style={{
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: pagination.currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
                      background: pagination.currentPage === pagination.totalPages ? '#f8fafc' : '#22c55e',
                      color: pagination.currentPage === pagination.totalPages ? '#cbd5e1' : 'white',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    »»
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedKendra && (
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
          }} onClick={() => setShowDetailModal(false)}>
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
              borderRadius: '20px',
              width: '90%',
              maxWidth: '700px',
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
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    <Building2 size={18} color="white" />
                  </span>
                  केंद्र विवरण
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
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

              {/* Modal Content */}
              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Basic Info Section */}
                <div style={{
                  background: '#f8fafc',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '2px solid #e2e8f0'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1e293b',
                    margin: '0 0 16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}>
                      ID: {selectedKendra.k_id}
                    </span>
                    बुनियादी जानकारी
                  </h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>केंद्र का नाम</label>
                        <div style={{ fontSize: '16px', color: '#1e293b', fontWeight: 600, marginTop: '4px' }}>{selectedKendra.k_name}</div>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>लॉगिन आईडी</label>
                        <div style={{ fontSize: '16px', color: '#1e293b', fontWeight: 600, marginTop: '4px' }}>
                          <Lock size={16} className="inline-block mr-2" />
                          {selectedKendra.login_id}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>विवरण</label>
                      <div style={{ fontSize: '16px', color: '#1e293b', fontWeight: 600, marginTop: '4px' }}>
                        <MapPin size={16} className="inline-block mr-2" />
                        {selectedKendra.pariyojna_name},{selectedKendra.sector_name},{selectedKendra.k_name}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>परियोजना</label>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#1d4ed8', 
                          fontWeight: 600, 
                          marginTop: '4px',
                          background: '#eff6ff',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #bfdbfe'
                        }}>
                          {selectedKendra.pariyojna_name}
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>सेक्टर</label>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#dc2626', 
                          fontWeight: 600, 
                          marginTop: '4px',
                          background: '#fef2f2',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #fecaca'
                        }}>
                          {selectedKendra.sector_name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Statistics */}
                <div style={{
                  background: '#f0fdf4',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '2px solid #bbf7d0'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1e293b',
                    margin: '0 0 16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Users size={18} className="inline-block mr-2" />
                    छात्र सांख्यिकी
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
                    <div style={{
                      background: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '2px solid #dcfce7'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#15803d' }}>{selectedKendra.total_students}</div>
                      <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>कुल छात्र</div>
                    </div>
                    <div style={{
                      background: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '2px solid #dcfce7'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#059669' }}>{selectedKendra.active_students}</div>
                      <div style={{ fontSize: '12px', color: '#047857', fontWeight: 600 }}>सक्रिय छात्र</div>
                    </div>
                    <div style={{
                      background: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '2px solid #dcfce7'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>
                        {selectedKendra.total_students > 0 ? Math.round((selectedKendra.active_students / selectedKendra.total_students) * 100) : 0}%
                      </div>
                      <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>सक्रियता दर</div>
                    </div>
                  </div>
                  
                  {/* Student Management Button */}
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button
                      onClick={() => navigateToStudents(selectedKendra)}
                      style={{
                        background: 'linear-gradient(135deg, #059669, #10b981)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '16px 32px',
                        fontSize: '16px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        margin: '0 auto'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 12px 35px rgba(5, 150, 105, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <User size={20} />
                      छात्रों की जानकारी देखें
                    </button>
                  </div>
                </div>

                {/* Timestamps */}
                <div style={{
                  background: '#fefbf3',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '2px solid #fcd34d'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1e293b',
                    margin: '0 0 12px 0'
                  }}>
                    <Calendar size={16} className="inline-block mr-2" />
                    समय विवरण
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>बनाया गया</label>
                      <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>
                        {new Date(selectedKendra.k_createdAt).toLocaleString('hi-IN')}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>अंतिम अपडेट</label>
                      <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>
                        {new Date(selectedKendra.k_updatedAt).toLocaleString('hi-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
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
          }} onClick={() => setShowEditModal(false)}>
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
              borderRadius: '20px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
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
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    <Edit size={18} color="white" />
                  </span>
                  केंद्र संपादित करें
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
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

              {/* Edit Form */}
              <form onSubmit={handleEditKendra} style={{ display: 'grid', gap: '24px' }}>
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
                      केंद्र आईडी
                    </label>
                    <input
                      type="text"
                      value={editKendra.k_id}
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 500,
                        background: '#f3f4f6',
                        color: '#6b7280',
                        boxSizing: 'border-box'
                      }}
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
                      value={editKendra.ks_id}
                      onChange={handleEditInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 500,
                        background: '#f8fafc',
                        color: '#1e293b',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      required
                    >
                      <option value="">सेक्टर चुनें</option>
                      {masterData.sectors.map(sector => (
                        <option key={sector.s_id} value={sector.s_id}>
                          {sector.s_name}
                        </option>
                      ))}
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
                      value={editKendra.kp_id}
                      onChange={handleEditInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 500,
                        background: '#f8fafc',
                        color: '#1e293b',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      required
                    >
                      <option value="">परियोजना चुनें</option>
                      {masterData.pariyojnas.map(pariyojna => (
                        <option key={pariyojna.p_id} value={pariyojna.p_id}>
                          {pariyojna.p_name}
                        </option>
                      ))}
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
                      value={editKendra.login_id}
                      onChange={handleEditInputChange}
                      placeholder="उदाहरण: admin001"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 500,
                        background: '#f8fafc',
                        color: '#1e293b',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box'
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
                    value={editKendra.k_name}
                    onChange={handleEditInputChange}
                    placeholder="केंद्र का नाम दर्ज करें"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                      background: '#f8fafc',
                      color: '#1e293b',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      boxSizing: 'border-box'
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
                    value={editKendra.k_address}
                    onChange={handleEditInputChange}
                    placeholder="पूरा पता दर्ज करें"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                      background: '#f8fafc',
                      color: '#1e293b',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical',
                      boxSizing: 'border-box'
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
                    पासवर्ड
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={editKendra.password}
                    onChange={handleEditInputChange}
                    placeholder="नया पासवर्ड दर्ज करें (वैकल्पिक)"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                      background: '#f8fafc',
                      color: '#1e293b',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
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
                    onClick={() => setShowEditModal(false)}
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
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
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
                      e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    अपडेट करें
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
          }} onClick={() => { resetForm(); setShowAddModal(false); }}>
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
                    <Building2 size={18} color="white" />
                  </span>
                  नया केंद्र जोड़ें
                </h2>
                <button
                  onClick={() => { resetForm(); setShowAddModal(false); }}
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
                {/* First Row: Pariyojna and Sector */}
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
                        color: '#1e293b',
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
                      {masterData.pariyojnas.map(pariyojna => (
                        <option key={pariyojna.p_id} value={pariyojna.p_id}>
                          {pariyojna.p_name}
                        </option>
                      ))}
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
                      सेक्टर *
                    </label>
                    <select
                      name="ks_id"
                      value={newKendra.ks_id}
                      onChange={handleInputChange}
                      disabled={!newKendra.kp_id}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#1e293b',
                        background: newKendra.kp_id ? '#f8fafc' : '#f3f4f6',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box',
                        cursor: newKendra.kp_id ? 'pointer' : 'not-allowed'
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
                      <option value="">
                        {newKendra.kp_id ? 'सेक्टर चुनें' : 'पहले परियोजना चुनें'}
                      </option>
                      {filteredSectors.map(sector => (
                        <option key={sector.s_id} value={sector.s_id}>
                          {sector.s_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Second Row: Kendra Name */}
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
                      color: '#1e293b',
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

                {/* Third Row: Address */}
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
                      color: '#1e293b',
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

                {/* Fourth Row: Login ID and Password */}
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
                        color: '#1e293b',
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
                        color: '#1e293b',
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
                    onClick={() => { resetForm(); setShowAddModal(false); }}
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

        {/* Photo Modal */}
        {showPhotoModal && selectedKendra && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={handleClosePhotoModal}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '1200px',
                maxHeight: '90vh',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                padding: '24px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h2 style={{
                    margin: '0 0 8px 0',
                    fontSize: '24px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Camera size={28} />
                    पौधों की तस्वीरें
                  </h2>
                  <p style={{
                    margin: 0,
                    fontSize: '16px',
                    opacity: 0.9,
                    fontWeight: 500
                  }}>
                    केंद्र: {selectedKendra.k_name}
                  </p>
                </div>
                <button
                  onClick={handleClosePhotoModal}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  title="बंद करें"
                >
                  <X size={20} color="white" />
                </button>
              </div>

              {/* Content */}
              <div style={{
                padding: '32px',
                maxHeight: 'calc(90vh - 120px)',
                overflowY: 'auto'
              }}>
                {photoLoading ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    gap: '20px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      border: '4px solid #e2e8f0',
                      borderTop: '4px solid #8b5cf6',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{
                      color: '#64748b',
                      fontSize: '18px',
                      fontWeight: 500,
                      margin: 0
                    }}>
                      तस्वीरें लोड हो रही हैं...
                    </p>
                  </div>
                ) : kendraPhotos.length > 0 ? (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '24px',
                      padding: '16px 20px',
                      background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                      borderRadius: '12px',
                      border: '1px solid #0ea5e9'
                    }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#0c4a6e'
                      }}>
                        कुल {kendraPhotos.length} तस्वीरें मिलीं
                      </h3>
                      <div style={{
                        background: '#0ea5e9',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 600
                      }}>
                        Latest पौधों की फोटो
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '20px'
                    }}>
                      {kendraPhotos.map((photo, index) => (
                        <div key={photo.p_id} style={{
                          background: 'white',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.3s ease'
                        }}>
                          <div style={{
                            position: 'relative',
                            height: '200px',
                            overflow: 'hidden'
                          }}>
                            <img
                              src={`${serverURL}uploads/${photo.photo_url}`}
                              alt={`Plant ${photo.plant_number}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                console.log('Image load error for:', `${serverURL}uploads/${photo.photo_url}`);
                                e.target.src = 'https://via.placeholder.com/280x200/f1f5f9/64748b?text=No+Image';
                                e.target.style.backgroundColor = '#f1f5f9';
                              }}
                              onLoad={() => {
                                console.log('Image loaded successfully:', `${serverURL}uploads/${photo.photo_url}`);
                              }}
                            />
                            <div style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              background: 'rgba(0, 0, 0, 0.7)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600
                            }}>
                              पौधा #{photo.plant_number}
                            </div>
                          </div>
                          
                          <div style={{
                            padding: '16px'
                          }}>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '12px',
                              fontSize: '13px'
                            }}>
                              <div>
                                <span style={{ color: '#64748b', fontWeight: 500 }}>अपलोड:</span>
                                <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>
                                  {new Date(photo.created_at).toLocaleDateString('hi-IN')}
                                </div>
                              </div>
                              <div>
                                <span style={{ color: '#64748b', fontWeight: 500 }}>काउंटर:</span>
                                <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>
                                  {photo.counter}
                                </div>
                              </div>
                            </div>
                            
                            {(photo.latitude && photo.longitude) && (
                              <div style={{
                                marginTop: '12px',
                                padding: '8px 12px',
                                background: '#f8fafc',
                                borderRadius: '8px',
                                fontSize: '12px'
                              }}>
                                <span style={{ color: '#64748b', fontWeight: 500 }}>Location:</span>
                                <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>
                                  {parseFloat(photo.latitude).toFixed(6)}, {parseFloat(photo.longitude).toFixed(6)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    gap: '20px'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Camera size={36} color="#64748b" />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{
                        color: '#1e293b',
                        fontSize: '20px',
                        fontWeight: 700,
                        margin: '0 0 8px 0'
                      }}>
                        कोई तस्वीर नहीं मिली
                      </h3>
                      <p style={{
                        color: '#64748b',
                        fontSize: '16px',
                        margin: 0
                      }}>
                        इस केंद्र के लिए अभी तक कोई पौधों की तस्वीर अपलोड नहीं की गई है।
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AanganwadiStats;
