import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) return;
    
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error:`, error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error disconnecting from Database:', error);
  }
}
