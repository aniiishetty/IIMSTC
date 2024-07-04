// routes/userAuthRoutes.js
import express from 'express';
import { loginFaculty } from '../controllers/facultyAuthController.js';

const router = express.Router();

// User login endpoint
router.post('/facultylogin', loginFaculty);

export default router;
