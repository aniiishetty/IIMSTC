import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

const createUser = async (firstName, lastName, dateOfBirth) => {
  try {
    const response = await axios.post(`${API_URL}/create-user`, { firstName, lastName, dateOfBirth });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createFaculty = async (firstName, lastName, dateOfBirth) => {
  try {
    const response = await axios.post(`${API_URL}/create-faculty`, { firstName, lastName, dateOfBirth });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { createUser, createFaculty };
