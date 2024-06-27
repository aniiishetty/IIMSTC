import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/userlogin`, { username, password });
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw error;
  }
};

const userService = {
  login,
};

export default userService;
