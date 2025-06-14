import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // 💥 Load environment variables from .env

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("MONGO URI:", uri);

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    process.exit(1);
  }
};

export default connectDB;
