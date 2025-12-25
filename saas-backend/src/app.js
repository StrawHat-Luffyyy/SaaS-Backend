import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "../src/modules/auth/auth.routes.js"
import orgRoutes from "../src/modules/orgs/org.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/orgs", orgRoutes);

export default app;
