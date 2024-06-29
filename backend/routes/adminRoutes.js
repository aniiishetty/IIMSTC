// adminRoutes.js

import express from 'express';
import { createUser, createFaculty } from '../controllers/adminController.js';

const router = express.Router();

router.post('/create-user', createUser);
router.post('/create-faculty', createFaculty);

export default router;
