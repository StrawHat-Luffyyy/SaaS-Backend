import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";

dotenv.config();
connectDB();

const PORT = env.port || 3000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
