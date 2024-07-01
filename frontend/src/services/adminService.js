import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Function to create a user
const createUser = async (firstName, lastName, dateOfBirth) => {
  try {
    const response = await axios.post(`${API_URL}/create-user`, { firstName, lastName, dateOfBirth });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to create a faculty member
const createFaculty = async (firstName, lastName, department) => {
  try {
    const response = await axios.post(`${API_URL}/create-faculty`, { firstName, lastName, department });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to create a test
export const createTest = async (testData) => {
  try {
    const response = await axios.post(`${API_URL}/create-test`, testData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Function to upload questions from a CSV file
export const uploadQuestions = async (file) => {
  const formData = new FormData();
  formData.append('questionsFile', file);

  try {
    const response = await axios.post(`${API_URL}/upload-questions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export { createUser, createFaculty };
