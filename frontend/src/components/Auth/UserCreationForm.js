import React, { useState } from 'react';
import { createUser } from '../../services/adminService'; // Adjust the path as necessary
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

const UserCreationForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createUser(firstName, lastName, dateOfBirth);
      const { userId, password, msg } = data;
      setSuccessMessage(`${msg}: UserID: ${userId}, Password: ${password}`);
      setUserId(userId);
      setPassword(password);
      setErrorMessage('');
      setFirstName('');
      setLastName('');
      setDateOfBirth('');
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Failed to create user');
      console.error(error);
    }
  };

  const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: 'url(/path-to-your-background-image.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative'
  };

  const formStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '300px',
    textAlign: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3'
  };

  const messageStyle = {
    marginTop: '10px',
    color: 'green'
  };

  const errorStyle = {
    marginTop: '10px',
    color: 'red'
  };

  const copyStyle = {
    cursor: 'pointer',
    marginLeft: '5px',
    color: 'blue'
  };

  return (
    <div style={formContainerStyle}>
      <div style={formStyle}>
        <h2>Create User</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label>Date of Birth:</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            Create User
          </button>
        </form>
        {successMessage && (
          <p style={messageStyle}>
            {successMessage}
            <CopyToClipboard text={`UserID: ${userId}, Password: ${password}`} onCopy={() => setCopied(true)}>
              <FaCopy style={copyStyle} title="Copy to clipboard" />
            </CopyToClipboard>
          </p>
        )}
        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default UserCreationForm;
