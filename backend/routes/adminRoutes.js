import express from 'express';
import multer from 'multer';
import { createUser, createFaculty, createTest, uploadQuestions } from '../controllers/adminController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/create-user', createUser);
router.post('/create-faculty', createFaculty);
router.post('/create-test', createTest);
router.post('/upload-questions', upload.single('questionsFile'), uploadQuestions);

export default router;
