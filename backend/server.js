import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userAuthRoutes from './routes/userAuthRoutes.js'; // Add this line
import testRoutes from './routes/testRoutes.js';
dotenv.config();
const app = express();

// Connect to MongoDB
connectDB().then(() => {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(morgan('dev'));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use(limiter);

  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/users', userAuthRoutes); // Add this line
  app.use('/api/tests', testRoutes);
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`MongoDB connected successfully`);
  });

  app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    console.error(`Stack trace: ${err.stack}`);
    res.status(500).send('Internal Server Error');
  });
});
