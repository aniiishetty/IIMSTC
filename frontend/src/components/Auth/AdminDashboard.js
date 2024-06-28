import React, { useState } from 'react';
import { createUser, createFaculty } from '../../services/adminService'; // Adjust the path as necessary
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

const AdminDashboard = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });

  const [facultyData, setFacultyData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });

  const [userResponse, setUserResponse] = useState(null);
  const [facultyResponse, setFacultyResponse] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // State for toggling sidebar visibility

  const handleUserChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFacultyChange = (e) => {
    setFacultyData({
      ...facultyData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(userData.firstName, userData.lastName, userData.dateOfBirth);
      setUserResponse(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createFaculty(facultyData.firstName, facultyData.lastName, facultyData.dateOfBirth);
      setFacultyResponse(response);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const panelStyle = {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative', // Added position relative for proper icon placement
  };

  const sidebarStyle = {
    width: sidebarOpen ? '20%' : '5%', // Adjust width based on sidebarOpen state
    height: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRight: '1px solid #ccc',
    transition: 'width 0.3s ease',
    position: 'relative',
  };

  const sidebarToggleStyle = {
    fontSize: '24px',
    cursor: 'pointer',
    position: 'absolute',
    top: '20px',
    right: sidebarOpen ? 'calc(20% - 20px)' : 'calc(5% - 20px)', // Adjust based on sidebarOpen state
    transition: 'right 0.3s ease',
  };

  const optionStyle = {
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    textAlign: 'center',
    fontSize: sidebarOpen ? '14px' : '12px', // Adjust font size based on sidebarOpen state
  };

  const activeOptionStyle = {
    ...optionStyle,
    backgroundColor: '#0056b3',
  };

  const contentStyle = {
    width: sidebarOpen ? '80%' : '95%', // Adjust width based on sidebarOpen state
    padding: '20px',
    transition: 'width 0.3s ease',
  };

  const formStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  const messageStyle = {
    marginTop: '10px',
    color: 'green',
  };

  const errorStyle = {
    marginTop: '10px',
    color: 'red',
  };

  const copyStyle = {
    cursor: 'pointer',
    marginLeft: '5px',
    color: 'blue',
  };

  return (
    <div style={panelStyle}>
      <div style={sidebarStyle}>
        <div
          style={sidebarToggleStyle}
          onClick={toggleSidebar}
        >
          ☰
        </div>
        <div
          style={sidebarOpen ? activeOptionStyle : optionStyle}
          onClick={() => setSidebarOpen(true)}
        >
          Create User
        </div>
        <div
          style={!sidebarOpen ? activeOptionStyle : optionStyle}
          onClick={() => setSidebarOpen(false)}
        >
          Create Faculty
        </div>
      </div>
      <div style={contentStyle}>
        {sidebarOpen && (
          <div style={{ ...formStyle, width: 'calc(100% - 40px)' }}> {/* Adjusted width to fit content */}
            <h2>Create User</h2>
            <form onSubmit={handleUserSubmit}>
              <div>
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleUserChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleUserChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={userData.dateOfBirth}
                  onChange={handleUserChange}
                  required
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                style={{ ...buttonStyle, width: '100%' }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
              >
                Create User
              </button>
            </form>
            {userResponse && (
              <p style={messageStyle}>
                User Created: UserID: {userResponse.userId}, Password: {userResponse.password}
                <CopyToClipboard text={`UserID: ${userResponse.userId}, Password: ${userResponse.password}`} onCopy={() => setCopied(true)}>
                  <FaCopy style={copyStyle} title="Copy to clipboard" />
                </CopyToClipboard>
              </p>
            )}
          </div>
        )}
        {!sidebarOpen && (
          <div style={{ ...formStyle, width: 'calc(100% - 40px)' }}> {/* Adjusted width to fit content */}
            <h2>Create Faculty</h2>
            <form onSubmit={handleFacultySubmit}>
              <div>
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={facultyData.firstName}
                  onChange={handleFacultyChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={facultyData.lastName}
                  onChange={handleFacultyChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={facultyData.dateOfBirth}
                  onChange={handleFacultyChange}
                  required
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                style={{ ...buttonStyle, width: '100%' }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
              >
                Create Faculty
              </button>
            </form>
            {facultyResponse && (
              <p style={messageStyle}>
                Faculty Created: FacultyID: {facultyResponse.facultyId}, Password: {facultyResponse.password}
                <CopyToClipboard text={`FacultyID: ${facultyResponse.facultyId}, Password: ${facultyResponse.password}`} onCopy={() => setCopied(true)}>
                  <FaCopy style={copyStyle} title="Copy to clipboard" />
                </CopyToClipboard>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
