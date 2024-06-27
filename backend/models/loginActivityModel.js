// models/loginActivityModel.js
import mongoose from 'mongoose';

const loginActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: String,
});

const LoginActivity = mongoose.model('LoginActivity', loginActivitySchema);

export default LoginActivity;
