// models/ActiveSession.js
import mongoose from 'mongoose';

const ActiveSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Additional fields as needed (e.g., lastActiveAt, userAgent, etc.)
});

const ActiveSession = mongoose.model('ActiveSession', ActiveSessionSchema);

export default ActiveSession;
