import mongoose from "mongoose";

const initDb = async (): Promise<mongoose.Mongoose | null> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    const db = await mongoose.connect(mongoUri);

    console.log('MongoDB connected successfully!');

    return db;
  } catch (error) {
    console.error('MongoDB connection failed:', error);

    return null;
  }
};

export default initDb;