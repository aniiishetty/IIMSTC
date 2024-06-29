import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import userAuthService from '../../services/userAuthService';

const LoginForm = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await userAuthService.login(userId, password);
      console.log(response); // Handle success (e.g., store token)

      // Navigate to '/' after successful login
      navigate('/user-test');
    } catch (error) {
      setError('Invalid credentials. Please try again.'); // Handle error
    }
  };

  const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: 'url(https://iimstc.com/wp-content/uploads/slider/cache/e0a4105f14d43d1eae165e5b1f24238b/slider23.jpg)',
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
    width: '80%',
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

  const errorStyle = {
    color: 'red',
    marginBottom: '10px'
  };

  const checkboxStyle = {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const topLeftImageStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    width: '150px',
    height: '80px'
  };

  return (
    <div style={formContainerStyle}>
      <img src="https://iimstc.com/wp-content/uploads/2021/10/log.png" alt="Top Left" style={topLeftImageStyle} />
      <div style={formStyle}>
        <h2>Login</h2>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleLogin}>
          <label>
            User ID:
            <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} style={inputStyle} />
          </label>
          <br />
          <label>
            Password:
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </label>
          <br />
          <div style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label style={{ marginLeft: '5px' }}>Show Password</label>
          </div>
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
