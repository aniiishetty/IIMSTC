import mongoose from 'mongoose';

const connectFn = async () => {
    await mongoose.connect('mongodb://localhost:27017/iimstc', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  };

const connectDB = async () => {
  let retries = 3;
  let delay = 1000;

  for (let i = 0; i < retries; i++) {
    try {
      await connectFn();
      console.log('MongoDB Connected');
      return;
    } catch (error) {
      console.error(`MongoDB connection error (attempt ${i + 1}):`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // exponential backoff
    }
  }

  console.error('MongoDB connection failed after', retries, 'attempts');
  process.exit(1);
};

export default connectDB;