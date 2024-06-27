import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const containerStyle = {
    backgroundImage: 'url(https://iimstc.com/wp-content/uploads/slider/cache/e0a4105f14d43d1eae165e5b1f24238b/slider23.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    position: 'relative'
  };

  const topLeftImageStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    width: '100px', // Adjust the size as needed
    height: 'auto'
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

  return (
    <div style={containerStyle}>
      <img src="https://iimstc.com/wp-content/uploads/2021/10/log.png" alt="Top Left" style={topLeftImageStyle} />
      <h2>Welcome to the Home Page</h2>
      <p>This is the home page content.</p>
      <Link to="/login">
        <button
          style={buttonStyle}
          onMouseEnter={e => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseLeave={e => e.target.style.backgroundColor = buttonStyle.backgroundColor}
        >
          Go to Login
        </button>
      </Link>
    </div>
  );
};

export default Home;
