import bcrypt from 'bcrypt';
import Faculty from '../models/Faculty.js';
import CreateUser from '../models/CreateUser.js';

const generateUserId = (firstName, dateOfBirth) => {
  const namePart = firstName.toLowerCase(); // Convert first name to lowercase
  const dobPart = dateOfBirth.split('-')[1] + dateOfBirth.split('-')[2].slice(-2); // Get MMYY from date of birth
  return `${namePart}@${dobPart}`;
};

const generateRandomPassword = (lastName) => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit number
  return `${lastName}${randomDigits}`; // Concatenate last name and random digits
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

const generateFacultyId = (firstName, dateOfBirth) => {
  const namePart = firstName.toLowerCase();
  const dobPart = dateOfBirth.split('-')[1] + dateOfBirth.split('-')[2].slice(-2);
  return `${namePart}@${dobPart}`;
};

export const createFaculty = async (req, res) => {
  const { firstName, lastName, dateOfBirth } = req.body;

  if (!firstName || !lastName || !dateOfBirth) {
    return res.status(400).json({ msg: 'All fields are required' });
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
      password: hashedPassword,
    });

    await newFaculty.save();

    res.status(201).json({
      msg: 'Faculty created successfully',
      facultyId,
      password,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
