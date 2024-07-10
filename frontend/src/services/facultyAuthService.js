// src/services/userAuthService.js

const BASE_URL = 'http://localhost:5000/api/faculty'; // Update with your backend URL

const FacultyAuthService = {
  login: async (facultyId, password) => {
    const response = await fetch(`${BASE_URL}/facultylogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ facultyId, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed'); // Handle non-200 status codes
    }

    return response.json();
  },
};

export default FacultyAuthService;
