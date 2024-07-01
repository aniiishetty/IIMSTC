// testController.js

import Test from '../models/Test.js';
import express from 'express';

const app = express();
app.use(express.json());

export const getTestByTitle = async (testTitle) => {
  try {
    const test = await Test.findOne({ title: testTitle });

    if (!test) {
      throw new Error('Test not found');
    }

    // Map correctAnswer to each question starting from 0
    const populatedTest = test.toObject();
    populatedTest.questions = populatedTest.questions.map(question => ({
      ...question,
      correctAnswer: question.correctAnswer - 1  // Adjust correctAnswer to start from 0
    }));

    return populatedTest;
  } catch (error) {
    throw new Error(`Error fetching test: ${error.message}`);
  }
};
