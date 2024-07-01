import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tests'; // Adjust as per your backend API URL

export const getTestByTitle = async (title) => {
    try {
      const response = await axios.get(`${API_URL}/${title}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };