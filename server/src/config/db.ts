import mongoose from "mongoose";

const initDb = async (): Promise<boolean> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully!');

    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error);

    return false;
  }
};

export default initDb;