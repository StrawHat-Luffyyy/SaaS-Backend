import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "../src/modules/auth/auth.routes.js"
import orgRoutes from "../src/modules/orgs/org.routes.js";
import billingRoutes from "./modules/billings/billing.routes.js";
import usageRoutes from "./modules/billings/usage.routes.js";
import auditRoutes from "./modules/audit/audit.routes.js";
import healthRoutes from "./modules/health/health.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

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
app.use("/billing", billingRoutes);
app.use("/usage", usageRoutes);
app.use("/audit-logs", auditRoutes);
app.use("/health", healthRoutes);

app.use(errorHandler);
export default app;
