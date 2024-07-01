import express from 'express';
import { getTestByTitle } from '../controllers/testController.js';

const router = express.Router();

// Route to access test by title
router.get('/:title', getTestByTitle);

export default router;
