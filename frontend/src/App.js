import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Home from './components/Auth/Home'; // Ensure correct path to Home.js
import NotFound from './components/Auth/NotFound'; // Ensure correct path to NotFound.js
import AdminDashboard from './components/Auth/AdminDashboard';
import UserDashboard from './components/Auth/UserDashboard';
import LoginForm from './components/Auth/LoginForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/user-test" element={<UserDashboard />} />
            <Route path="/userlogin" element={<LoginForm />} />
            <Route path="*" element={<NotFound />} /> {/* Handle unknown routes */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
