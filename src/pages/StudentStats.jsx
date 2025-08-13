import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import InfoBox from '../components/InfoBox';
import '../styles/StudentStats.css';

const StudentStats = ({ onLogout }) => {
  const [filters, setFilters] = useState({
    pariyojna: '',
    sector: '',
    aanganwadi: '',
    student: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Sample data
  const students = [
    {
      id: 285,
      aanganwadi: 'CHC RAIPUR',
      s_name: 'jaya manikpuri',
      s_mobile: 8602214560,
      s_father: 'रामेश कुमार',
      s_mother: 'सुनीता देवी',
      s_gender: 'लड़की',
      s_dob: '9/8/2025',
      s_health_status: 'पूर्ण स्वस्थ',
      s_vaccination: 'कॉम्प्लीट',
      district: 'DHARSIWA',
      village: 'नयागांव'
    },
    {
      id: 284,
      aanganwadi: 'CHC RAIPUR',
      s_name: 'manisha sawara',
      s_mobile: 9244832337,
      s_father: 'अनिल शर्मा',
      s_mother: 'रीता शर्मा',
      s_gender: 'लड़की',
      s_dob: '8/8/2025',
      s_health_status: 'पूर्ण स्वस्थ',
      s_vaccination: 'कॉम्प्लीट',
      district: 'ARANG',
      village: 'रामपुर'
    },
    {
      id: 283,
      aanganwadi: 'CHC RAIPUR',
      s_name: 'anjali chelak',
      s_mobile: 9238189517,
      s_father: 'विजय सिंह',
      s_mother: 'कमला देवी',
      s_gender: 'लड़का',
      s_dob: '6/8/2025',
      s_health_status: 'पूर्ण स्वस्थ',
      s_vaccination: 'कॉम्प्लीट',
      district: 'ARANG',
      village: 'शिवपुर'
    },
    {
      id: 282,
      aanganwadi: 'CHC RAIPUR',
      s_name: 'payal patel',
      s_mobile: 6260202235,
      s_father: 'राम लाल',
      s_mother: 'गीता देवी',
      s_gender: 'लड़का',
      s_dob: '6/8/2025',
      s_health_status: 'सामान्य स्वस्थ',
      s_vaccination: 'इनकॉम्प्लीट',
      district: 'ARANG',
      village: 'पटेल नगर'
    },
    {
      id: 281,
      aanganwadi: 'CHC RAIPUR',
      s_name: 'Hiraundi Sahu',
      s_mobile: 9617722218,
      s_father: 'सुरेश साहू',
      s_mother: 'सुमित्रा साहू',
      s_gender: 'लड़की',
      s_dob: '5/8/2025',
      s_health_status: 'पूर्ण स्वस्थ',
      s_vaccination: 'कॉम्प्लीट',
      district: 'ARANG',
      village: 'साहू टोला'
    },
    {
      id: 280,
      aanganwadi: 'CHC RAIPUR',
      s_name: 'Jageshwari Tondon',
      s_mobile: 8253091771,
      s_father: 'अजय टंडन',
      s_mother: 'प्रिया टंडन',
      s_gender: 'लड़का',
      s_dob: '5/8/2025',
      s_health_status: 'पूर्ण स्वस्थ',
      s_vaccination: 'कॉम्प्लीट',
      district: 'ARANG',
      village: 'टंडन वार्ड'
    },
    {
      id: 279,
      aanganwadi: 'CHC RAIPUR',
      s_name: 'Ishwari yadav',
      s_mobile: 9171286949,
      s_father: 'मुकेश यादव',
      s_mother: 'रेखा यादव',
      s_gender: 'लड़का',
      s_dob: '5/8/2025',
      s_health_status: 'पूर्ण स्वस्थ',
      s_vaccination: 'कॉम्प्लीट',
      district: 'ARANG',
      village: 'यादव टोला'
    },
    {
      id: 278,
      aanganwadi: 'CHC RAIPUR',
      s_name: 'Shashi Dhiwar',
      s_mobile: 7354894598,
      s_father: 'रामू धीवर',
      s_mother: 'सीता धीवर',
      s_gender: 'लड़की',
      s_dob: '4/8/2025',
      s_health_status: 'सामान्य स्वस्थ',
      s_vaccination: 'कॉम्प्लीट',
      district: 'ARANG',
      village: 'धीवर गांव'
    },
    {
      id: 277,
      aanganwadi: 'CHC RAIPUR',
      s_name: 'Pallavi tandan',
      s_mobile: 7049534595,
      s_father: 'राकेश तांडन',
      s_mother: 'माला तांडन',
      s_gender: 'लड़का',
      s_dob: '7/8/2025',
      s_health_status: 'पूर्ण स्वस्थ',
      s_vaccination: 'कॉम्प्लीट',
      district: 'DHARSIWA',
      village: 'तांडन नगर'
    },
    {
      id: 276,
      aanganwadi: 'CHC RAIPUR',
      s_name: 'shayam kali kol',
      s_mobile: 6262549671,
      s_father: 'हरि कोल',
      s_mother: 'राधा कोल',
      s_gender: 'लड़की',
      s_dob: '5/8/2025',
      s_health_status: 'पूर्ण स्वस्थ',
      s_vaccination: 'कॉम्प्लीट',
      district: 'DHARSIWA',
      village: 'कोल बस्ती'
    }
  ];

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
                         student.aanganwadi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.s_health_status.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const infoBoxData = [
    {
      title: 'Total Students',
      count: filteredStudents.length.toString(),
      icon: '👥',
      color: 'green'
    },
    {
      title: 'Healthy Students',
      count: filteredStudents.filter(s => s.s_health_status === 'पूर्ण स्वस्थ').length.toString(),
      icon: '💚',
      color: 'light-green'
    },
    {
      title: 'Vaccinated',
      count: filteredStudents.filter(s => s.s_vaccination === 'कॉम्प्लीट').length.toString(),
      icon: '💉',
      color: 'brown'
    },
    {
      title: 'Active Records',
      count: filteredStudents.length.toString(),
      icon: '📝',
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

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'स्वस्थ': return '#4CAF50';
      case 'सामान्य': return '#2196F3';
      case 'कमज़ोर': return '#FF9800';
      case 'बीमार': return '#F44336';
      default: return '#666';
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} />
      
  <main className="dashboard-main with-filters">
        <div className="dashboard-header">
          <h1>Student Statistics</h1>
          <p>Manage and view student information</p>
        </div>

        {/* Filters */}
        <div className="filters-section card">
          <h3>Search & Filter</h3>
          
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="🔍 Search students by name, father, mother, address, or health status..."
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
                <option value="urban">Urban</option>
                <option value="rural">Rural</option>
                <option value="semi-urban">Semi-Urban</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Aanganwadi Kendra</label>
              <select
                name="aanganwadi"
                value={filters.aanganwadi}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">Select Aanganwadi</option>
                <option value="center1">Center 1 - Patna</option>
                <option value="center2">Center 2 - Gaya</option>
                <option value="center3">Center 3 - Muzaffarpur</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Student</label>
              <input
                type="text"
                name="student"
                value={filters.student}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Search student name..."
              />
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

        {/* Students Table */}
        <div className="students-section">
          <div className="section-header">
            <h3>बच्चों की सूची</h3>
            {searchTerm && (
              <span className="search-results">
                Showing {filteredStudents.length} of {students.length} students
              </span>
            )}
          </div>
          
          <div className="table-container">
            {filteredStudents.length > 0 ? (
              <table className="students-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>अस्पताल का नाम</th>
                    <th>माता का नाम</th>
                    <th>लिंग</th>
                    <th>जन्म तिथि</th>
                    <th>बच्चे का क्रम</th>
                    <th>ब्लॉक</th>
                    <th>प्रसव प्रकार</th>
                    <th>स्थिति</th>
                    <th>कार्य</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td><strong>{student.id}</strong></td>
                      <td><strong>{student.aanganwadi}</strong></td>
                      <td>
                        <div>
                          <strong>{student.s_name}</strong>
                          <br />
                          <small>{student.s_mobile}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`gender-badge ${student.s_gender === 'लड़की' ? 'girl' : 'boy'}`}>
                          {student.s_gender}
                        </span>
                      </td>
                      <td>{student.s_dob}</td>
                      <td>
                        <span className="health-badge healthy">
                          {student.s_health_status}
                        </span>
                      </td>
                      <td><strong>{student.district}</strong></td>
                      <td>
                        <span className={`vaccination-badge ${student.s_vaccination === 'कॉम्प्लीट' ? 'complete' : 'incomplete'}`}>
                          {student.s_vaccination}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge active">
                          सक्रिय
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-icon view"
                            onClick={() => openModal(student)}
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button 
                            className="btn-icon edit"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn-icon filter"
                            title="Filter"
                          >
                            🔍
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-results">
                <p>No students found matching your search criteria.</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          <div className="pagination">
            <button className="page-btn">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <button className="page-btn">5</button>
            <span>...</span>
            <button className="page-btn">»</button>
            <button className="page-btn">»</button>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedStudent && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>×</button>
              <h2>Student Details</h2>
              <div className="student-details">
                <div className="detail-group">
                  <label>ID:</label>
                  <span>{selectedStudent.id}</span>
                </div>
                <div className="detail-group">
                  <label>Name:</label>
                  <span>{selectedStudent.s_name}</span>
                </div>
                <div className="detail-group">
                  <label>Mobile:</label>
                  <span>{selectedStudent.s_mobile}</span>
                </div>
                <div className="detail-group">
                  <label>Father's Name:</label>
                  <span>{selectedStudent.s_father}</span>
                </div>
                <div className="detail-group">
                  <label>Mother's Name:</label>
                  <span>{selectedStudent.s_mother}</span>
                </div>
                <div className="detail-group">
                  <label>Gender:</label>
                  <span>{selectedStudent.s_gender}</span>
                </div>
                <div className="detail-group">
                  <label>Date of Birth:</label>
                  <span>{selectedStudent.s_dob}</span>
                </div>
                <div className="detail-group">
                  <label>Health Status:</label>
                  <span className="health-badge healthy">
                    {selectedStudent.s_health_status}
                  </span>
                </div>
                <div className="detail-group">
                  <label>Vaccination Status:</label>
                  <span className="vaccination-badge complete">
                    {selectedStudent.s_vaccination}
                  </span>
                </div>
                <div className="detail-group">
                  <label>Hospital/Aanganwadi:</label>
                  <span>{selectedStudent.aanganwadi}</span>
                </div>
                <div className="detail-group">
                  <label>District:</label>
                  <span>{selectedStudent.district}</span>
                </div>
                <div className="detail-group">
                  <label>Village:</label>
                  <span>{selectedStudent.village}</span>
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
