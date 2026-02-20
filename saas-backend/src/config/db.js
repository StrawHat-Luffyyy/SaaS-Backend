import mongoose from "mongoose";
import { env } from "../config/env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000, // Set a timeout for server selection
      maxPoolSize: 10, // Limit the number of connections in the pool
    });
    console.log(" MongoDB connected!!!");
  } catch (error) {
    console.error("Failed to connect to database ", error.message);
    process.exit(1);
  }
};
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed on app termination");
  process.exit(0);
});

export default connectDB;
