import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => v.length > 3,
      message: 'Username must be at least 4 characters',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (v) => v.length > 6,
      message: 'Password must be at least 7 characters',
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

AdminSchema.index({ username: 1 }, { unique: true });

export default mongoose.model('admin', AdminSchema);