import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getTestById = async (testId) => {
  try {
    const response = await axios.get(`${API_URL}/admin/tests/${testId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching test by ID:', error);
    throw error;
  }
};

export const submitTestAnswers = async (testId, answers) => {
  try {
    const response = await axios.post(`${API_URL}/tests/${testId}/submit`, { answers });
    return response.data;
  } catch (error) {
    console.error('Error submitting test answers:', error);
    throw error;
  }
};
