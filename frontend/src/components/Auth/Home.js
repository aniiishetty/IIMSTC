import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      <p>This is the home page content.</p>
      <Link to="/signup">
        <button>Go to Signup</button>
      </Link>
    </div>
  );
};

export default Home;
