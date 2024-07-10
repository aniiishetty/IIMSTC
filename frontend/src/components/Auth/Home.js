import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { login, register } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import userAuthService from '../../services/userAuthService';
import facultyAuthService from '../../services/facultyAuthService';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('admin');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(username, password);
      setAuth(data.token);
      navigate('/admin-dashboard', { replace: true });
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await register(username, password);
      setSelectedOption('admin');
      setUsername('');
      setPassword('');
      setError(null);
    } catch (err) {
      setError('Registration failed');
    }
  };

  const handleUserLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      await userAuthService.login(username, password);
      navigate('/user-test');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleFacultyLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      await facultyAuthService.login(username, password);
      navigate('/faculty-dashboard');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const renderForm = () => {
    switch (selectedOption) {
      case 'admin':
        return (
          <form className={styles.form} onSubmit={handleLoginSubmit}>
            {error && <p className={styles.error}>{error}</p>}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className={styles.input}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={styles.input}
            />
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <label style={{ color: 'white' }}>Show Password</label>
            </div>
            <button type="submit" className={styles.button}>
              Login
            </button>
            <p style={{ color: 'white' }}>
              Don't have an account?{' '}
              <button
                type="button"
                className={styles.link}
                onClick={() => setSelectedOption('signup')}
              >
                Sign Up
              </button>
            </p>
          </form>
        );
      case 'signup':
        return (
          <form className={styles.form} onSubmit={handleSignupSubmit}>
            {error && <p className={styles.error}>{error}</p>}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className={styles.input}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={styles.input}
            />
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <label style={{ color: 'white' }}>Show Password</label>
            </div>
            <button type="submit" className={styles.button}>
              Signup
            </button>
            <p style={{ color: 'white' }}>
              Already have an account?{' '}
              <button
                type="button"
                className={styles.link}
                onClick={() => setSelectedOption('admin')}
              >
                Login
              </button>
            </p>
          </form>
        );
      case 'userLogin':
        return (
          <form className={styles.form} onSubmit={handleUserLoginSubmit}>
            {error && <p className={styles.error}>{error}</p>}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="User ID"
              required
              className={styles.input}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={styles.input}
            />
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <label style={{ color: 'white' }}>Show Password</label>
            </div>
            <button type="submit" className={styles.button}>
              User Login
            </button>
          </form>
        );
      case 'facultyLogin':
        return (
          <form className={styles.form} onSubmit={handleFacultyLoginSubmit}>
            {error && <p className={styles.error}>{error}</p>}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Faculty ID"
              required
              className={styles.input}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={styles.input}
            />
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <label style={{ color: 'black' }}>Show Password</label>
            </div>
            <button type="submit" className={styles.button}>
              Faculty Login
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.container} ${styles.alignRight}`}>
      <img src="https://iimstc.com/wp-content/uploads/2021/10/log.png" alt="Top Left" className={styles.topLeftImage} />
    
      
      <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        className={styles.dropdown}
      >
        <option value="admin">Admin Login</option>
        {/* <option value="signup">Sign Up</option> */}
        <option value="userLogin">User Login</option>
        <option value="facultyLogin">Faculty Login</option>
      </select>
      {renderForm()}
      {/* Added div with id and class as requested */}
      <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '15px', lineHeight: '26px', fontWeight: '400', fontStyle: 'normal', padding: '0', margin: '0', width: '100%' }}>
    <h1 style={{ fontFamily: 'Roboto', fontSize: '40px', lineHeight: '44px', fontWeight: '500', fontStyle: 'normal', textAlign: 'left', color: '#00853b', margin: '0', padding: '0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ backgroundColor: 'rgba(0, 128, 59, 0.5)', color: 'white', padding: '10px 0' }}>
            Welcome to 
        </span>
        <br/><br/>
        <span style={{ backgroundColor: 'rgba(0, 128, 59, 0.5)', color: 'white', padding: '10px 0' }}>
            ARCYON INTERNATIONAL INSTITUTE OF 
            <br/>
            MEDICAL SCIENCE AND TECHNOLOGY COUNCIL
        </span>
    </h1>
</div>





        
    </div>
    
  );
};

export default Home;
