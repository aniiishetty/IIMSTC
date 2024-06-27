// routes/userRoutes.js
import express from 'express';
import { loginUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/userlogin', loginUser);

export default router;
