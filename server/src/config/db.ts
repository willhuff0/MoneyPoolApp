import mongoose from "mongoose";

const initDb = async (): Promise<mongoose.mongo.ClientSession | null> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    const db = await mongoose.connect(mongoUri);
    const session = await db.startSession();

    console.log('MongoDB connected successfully!');

    return session;
  } catch (error) {
    console.error('MongoDB connection failed:', error);

    return null;
  }
};

export default initDb;