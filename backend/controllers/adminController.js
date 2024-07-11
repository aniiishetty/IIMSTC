// controllers/adminController.js

import express from 'express';
import bcrypt from 'bcrypt';
import csv from 'csv-parser';
import fs from 'fs';
import Faculty from '../models/Faculty.js';
import CreateUser from '../models/CreateUser.js';
import Test from '../models/Test.js';

const app = express();
app.use(express.json());

const generateUserId = (firstName, dateOfBirth) => {
  const namePart = firstName.toLowerCase();
  const dobPart = dateOfBirth.split('-')[1] + dateOfBirth.split('-')[2].slice(-2);
  return `${namePart}@${dobPart}`;
};
const generateFacultyId = (firstName, dateOfBirth) => {
  const namePart = firstName.toLowerCase();
  const dobPart = dateOfBirth.split('-')[1] + dateOfBirth.split('-')[2].slice(-2);
  return `${namePart}@${dobPart}`;
};

const generateRandomPassword = (lastName) => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${lastName}${randomDigits}`;
};

export const createUser = async (req, res) => {
  const { firstName, lastName, dateOfBirth } = req.body;

  if (!firstName || !lastName || !dateOfBirth) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  const userId = generateUserId(firstName, dateOfBirth);
  const password = generateRandomPassword(lastName);
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new CreateUser({
      userId,
      firstName,
      lastName,
      dateOfBirth,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      msg: 'User created successfully',
      userId,
      password
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const createFaculty = async (req, res) => {
  const { firstName, lastName, dateOfBirth } = req.body;

  if (!firstName || !lastName ||  !dateOfBirth) {
    return res.status(400).json({ msg: 'All fields (firstName, lastName, dateOfBirth) are required' });
  }

  const facultyId = generateFacultyId(firstName, dateOfBirth);
  const password = generateRandomPassword(lastName);
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newFaculty = new Faculty({
      facultyId,
      firstName,
      lastName,
      dateOfBirth,
      password: hashedPassword
    });

    await newFaculty.save();

    res.status(201).json({
      msg: 'Faculty created successfully',
      facultyId,
      password
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const createTest = async (req, res) => {
  const { title, questions, noTabSwitch, webcamAccess, timeLimit } = req.body;

  if (!title || !questions || noTabSwitch === undefined || webcamAccess === undefined || !timeLimit) {
    return res.status(400).json({ message: 'All fields (title, questions, noTabSwitch, webcamAccess, timeLimit) are required' });
  }

  if (typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ message: 'Title must be a non-empty string' });
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: 'Questions must be a non-empty array' });
  }

  for (let question of questions) {
    if (typeof question !== 'object' || !question.text || !Array.isArray(question.options) || question.options.length === 0) {
      return res.status(400).json({ message: 'Each question must be an object with text and non-empty options array' });
    }
    question.correctAnswer = parseInt(question.correctAnswer, 10); // Ensure correctAnswer is parsed to int
  }

  if (typeof noTabSwitch !== 'boolean') {
    return res.status(400).json({ message: 'noTabSwitch must be a boolean value' });
  }

  if (typeof webcamAccess !== 'boolean') {
    return res.status(400).json({ message: 'webcamAccess must be a boolean value' });
  }

  if (typeof timeLimit !== 'number' || timeLimit <= 0 || !Number.isInteger(timeLimit)) {
    return res.status(400).json({ message: 'timeLimit must be a positive integer number' });
  }

  try {
    const newTest = new Test({
      title,
      questions,
      noTabSwitch,
      webcamAccess,
      timeLimit
    });

    await newTest.save();

    res.status(201).json({
      message: 'Test created successfully',
      testId: newTest._id
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    } else {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
};

export const uploadQuestions = async (req, res) => {
  const filePath = req.file.path;

  const questions = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      questions.push({
        text: row.question,
        options: [row.option1, row.option2, row.option3, row.option4],
        correctAnswer: parseInt(row.correctAnswer, 10) - 1 // Adjusting correctAnswer index to start from 0
      });
    })
    .on('end', async () => {
      try {
        const test = new Test({ 
          title: req.body.title, 
          questions, 
          noTabSwitch: req.body.noTabSwitch, 
          webcamAccess: req.body.webcamAccess, 
          timeLimit: req.body.timeLimit 
        });
        await test.save();
        res.status(201).json({ message: 'Questions uploaded and test created successfully', test });
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
      } finally {
        // Cleanup: Delete the uploaded CSV file after processing
        fs.unlinkSync(filePath);
      }
    });
};

export default app;
