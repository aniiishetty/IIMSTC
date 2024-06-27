import express from 'express';
import { check } from 'express-validator';
const router = express.Router();
import { registerAdmin, loginAdmin } from '../controllers/authController.js';

router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  registerAdmin
);

router.post(
  '/login',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').exists()
  ],
  loginAdmin
);

export default router;