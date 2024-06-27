import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Home from './components/Auth/Home'; // Ensure correct path to Home.js
import NotFound from './components/Auth/NotFound'; // Ensure correct path to NotFound.js
import UserCreationForm from './components/Auth/UserCreationForm';
import UserLogin from './components/Auth/UserLogin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/create-user" element={<UserCreationForm />} />
            <Route path="/userlogin" element={<UserLogin />} />
            <Route path="*" element={<NotFound />} /> {/* Handle unknown routes */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
