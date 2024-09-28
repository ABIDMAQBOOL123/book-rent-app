import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect( 'mongodb+srv://abidmaqbool26:3W7wfHmePUzo2xSi@cluster0.fm9fu.mongodb.net/', {
      
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;

