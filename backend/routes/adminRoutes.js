// adminRoutes.js

import express from 'express';
import { createUser } from '../controllers/adminController.js';
import { createFaculty } from '../controllers/adminController.js'; // Import createFaculty from adminService

const router = express.Router();

router.post('/create-user', createUser);
router.post('/create-faculty', createFaculty);

export default router;
