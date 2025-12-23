import mongoose from "mongoose";
import { env } from "../config/env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log(" MongoDB connected!!!");
  } catch (error) {
    console.log("Failed to connect to database ", error);
    process.exit(1);
  }
};

export default connectDB;