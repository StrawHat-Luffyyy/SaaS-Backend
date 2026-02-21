import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";



const startServer = async () => {
  await connectDB();

  const PORT = env.port || 3000;

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${env.appEnv} mode`);
  });

  const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received — shutting down gracefully`);

    server.close(async () => {
      console.log("HTTP server closed");
      try {
        
        await mongoose.connection.close();
        await redis.quit();
        console.log("DB and Redis connections closed");
        process.exit(0);
      } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
      }
    });

    setTimeout(() => {
      console.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10_000); // 10 second hard limit
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // Docker / K8s
  process.on("SIGINT",  () => gracefulShutdown("SIGINT"));  // Ctrl+C in terminal

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    gracefulShutdown("UNHANDLED_REJECTION");
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    gracefulShutdown("UNCAUGHT_EXCEPTION");
  });
};

startServer();