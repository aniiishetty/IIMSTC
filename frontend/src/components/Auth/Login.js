import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [error, setError] = useState(null);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate(); // Get the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      const data = await login(username, password);
      setAuth(data.token);
      navigate('/admin-dashboard', { replace: true }); // Navigate to Home page after successful login
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '300px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white'
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
    marginTop: '20px',
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
    alignItems: 'center'
  };

  const signupTextStyle = {
    marginTop: '10px',
    textAlign: 'center'
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      {error && <p style={errorStyle}>{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        style={inputStyle}
      />
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        style={inputStyle}
      />
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
      <p style={signupTextStyle}>Don't have an account? <a href="/signup">Sign Up</a></p>
    </form>
  );
};

export default Login;
