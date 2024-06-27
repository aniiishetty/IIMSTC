// controllers/userController.js
import User from '../models/User.js';
import LoginActivity from '../models/loginActivityModel.js';

// Login user
const loginUser = async (req, res, next) => {
  const { userId, password } = req.body;
  
  try {
    const user = await User.findOne({ userId });

    if (!user || user.password !== password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Log login activity
    const loginActivity = new LoginActivity({ userId: user._id, ip: req.ip });
    await loginActivity.save();

    res.json({ msg: 'Login successful', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

export { loginUser };
