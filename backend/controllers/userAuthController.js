// controllers/userAuthController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/CreateUser.js';
import ActiveSession from '../models/ActiveSession.js'; // Import ActiveSession model

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Example expiration time
  });
};

export const loginUser = async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Find user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(userId);

    // Save session in activeSessions collection
    const activeSession = new ActiveSession({
      userId,
      token,
    });

    await activeSession.save();

    res.json({ msg: 'Login successful', token });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
