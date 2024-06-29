import React, { useState } from 'react';
import { createUser, createFaculty } from '../../services/adminService'; // Adjust the path as necessary
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

const AdminDashboard = () => {
  // State for user creation form
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });

  // State for faculty creation form
  const [facultyData, setFacultyData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });

  // State to manage responses from API calls
  const [userResponse, setUserResponse] = useState(null);
  const [facultyResponse, setFacultyResponse] = useState(null);

  // State for copy button status
  const [copied, setCopied] = useState(false);

  // State to manage sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle input change for user creation form
  const handleUserChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle input change for faculty creation form
  const handleFacultyChange = (e) => {
    setFacultyData({
      ...facultyData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submission of user creation form
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(userData.firstName, userData.lastName, userData.dateOfBirth);
      setUserResponse(response);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Handle submission of faculty creation form
  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createFaculty(facultyData.firstName, facultyData.lastName, facultyData.dateOfBirth);
      setFacultyResponse(response);
    } catch (error) {
      console.error('Error creating faculty:', error);
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Styles for layout and components
  const panelStyle = {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  };

  const sidebarStyle = {
    width: sidebarOpen ? '20%' : '5%',
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
    right: sidebarOpen ? 'calc(20% - 20px)' : 'calc(5% - 20px)',
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
    fontSize: sidebarOpen ? '14px' : '12px',
  };

  const activeOptionStyle = {
    ...optionStyle,
    backgroundColor: '#0056b3',
  };

  const contentStyle = {
    width: sidebarOpen ? '80%' : '95%',
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
    marginTop: '10px',
  };

  const buttonDisabledStyle = {
    ...buttonStyle,
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  };

  // Handle active form selection
  const [activeForm, setActiveForm] = useState('createUser');

  return (
    <div style={panelStyle}>
      <div style={sidebarStyle}>
        {/* Sidebar toggle button */}
        <div style={sidebarToggleStyle} onClick={toggleSidebar}>
          {sidebarOpen ? '<' : '>'}
        </div>
        {/* Sidebar options */}
        <button
          style={activeForm === 'createUser' ? activeOptionStyle : optionStyle}
          onClick={() => setActiveForm('createUser')}
        >
          {sidebarOpen ? 'Create User' : 'User'}
        </button>
        <button
          style={activeForm === 'createFaculty' ? activeOptionStyle : optionStyle}
          onClick={() => setActiveForm('createFaculty')}
        >
          {sidebarOpen ? 'Create Faculty' : 'Faculty'}
        </button>
      </div>
      <div style={contentStyle}>
        {/* Form for creating users */}
        {activeForm === 'createUser' && (
          <form style={formStyle} onSubmit={handleUserSubmit}>
            <h2>Create User</h2>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleUserChange}
              placeholder="First Name"
              style={inputStyle}
            />
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleUserChange}
              placeholder="Last Name"
              style={inputStyle}
            />
            <input
              type="date"
              name="dateOfBirth"
              value={userData.dateOfBirth}
              onChange={handleUserChange}
              placeholder="Date of Birth"
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Create User
            </button>
            {userResponse && (
              <div>
                <p>Username: {userResponse.username}</p>
                <p>Password: {userResponse.password}</p>
                <CopyToClipboard text={userResponse.password} onCopy={() => setCopied(true)}>
                  <button style={buttonStyle}>
                    <FaCopy />
                  </button>
                </CopyToClipboard>
              </div>
            )}
          </form>
        )}
        {/* Form for creating faculty */}
        {activeForm === 'createFaculty' && (
          <form style={formStyle} onSubmit={handleFacultySubmit}>
            <h2>Create Faculty</h2>
            <input
              type="text"
              name="firstName"
              value={facultyData.firstName}
              onChange={handleFacultyChange}
              placeholder="First Name"
              style={inputStyle}
            />
            <input
              type="text"
              name="lastName"
              value={facultyData.lastName}
              onChange={handleFacultyChange}
              placeholder="Last Name"
              style={inputStyle}
            />
            <input
              type="date"
              name="dateOfBirth"
              value={facultyData.dateOfBirth}
              onChange={handleFacultyChange}
              placeholder="Date of Birth"
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Create Faculty
            </button>
            {facultyResponse && (
              <div>
                <p>Username: {facultyResponse.username}</p>
                <p>Password: {facultyResponse.password}</p>
                <CopyToClipboard text={facultyResponse.password} onCopy={() => setCopied(true)}>
                  <button style={buttonStyle}>
                    <FaCopy />
                  </button>
                </CopyToClipboard>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
