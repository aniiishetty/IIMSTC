// src/services/userAuthService.js

const BASE_URL = 'http://localhost:5000/api/users'; // Update with your backend URL

const userAuthService = {
  login: async (userId, password) => {
    const response = await fetch(`${BASE_URL}/userlogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed'); // Handle non-200 status codes
    }

    return response.json();
  },
};

export default userAuthService;
