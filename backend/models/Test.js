// Test.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

const QuestionSchema = new Schema({
    text: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true } // Store zero-based index
});

const TestSchema = new Schema({
    title: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
    noTabSwitch: { type: Boolean, default: false },
    webcamAccess: { type: Boolean, default: false },
    timeLimit: { type: Number, default: 0 }
});

const Test = mongoose.model('Test', TestSchema);

export default Test;
