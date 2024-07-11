import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Faculty from '../models/Faculty.js'; // Adjust the path to match your model

const generateToken = (facultyId) => {
  return jwt.sign({ facultyId }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Example expiration time
  });
};

export const loginFaculty = async (req, res) => {
  const { facultyId, password } = req.body;

  try {
    // Find faculty member by facultyId
    const faculty = await Faculty.findOne({ facultyId });

    if (!faculty) {
      return res.status(404).json({ msg: 'Faculty not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, faculty.password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(facultyId);

    // Return the token (or any other relevant data) to indicate successful login
    res.json({ msg: 'Login successful', token });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
