// routes/userAuthRoutes.js
import express from 'express';
import { loginUser } from '../controllers/userAuthController.js';

const router = express.Router();

// User login endpoint
router.post('/userlogin', loginUser);

export default router;
