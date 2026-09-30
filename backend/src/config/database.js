import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({
  path: fileURLToPath(new URL('../../.env', import.meta.url))
});

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || '';

  if (!mongoUri) {
    console.warn('MONGODB_URI is not configured. MongoDB persistence is disabled for this environment.');
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    return false;
  }
};

export const getMongoStatus = () => mongoose.connection.readyState;
