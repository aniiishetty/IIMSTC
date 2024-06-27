// models/User.js
import mongoose from 'mongoose';

const CreateUserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const CreateUser = mongoose.model('CreateUser', CreateUserSchema);

export default CreateUser;
