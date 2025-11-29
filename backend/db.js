import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ;

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  // MongoDB disconnected
});

mongoose.connection.on('error', (err) => {
  // MongoDB connection error
});