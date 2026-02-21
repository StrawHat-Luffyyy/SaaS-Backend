import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import authRoutes from "./modules/auth/auth.routes.js";
import orgRoutes from "./modules/orgs/org.routes.js";
import billingRoutes from "./modules/billings/billing.routes.js";
import usageRoutes from "./modules/billings/usage.routes.js";
import auditRoutes from "./modules/audit/audit.routes.js";
import healthRoutes from "./modules/health/health.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import analyticsRouter from "./modules/analytics/analytics.routes.js";
import { env } from "./config/env.js";

const app = express();
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: env.allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/orgs`, orgRoutes);
app.use(`${API_PREFIX}/billing`, billingRoutes);
app.use(`${API_PREFIX}/usage`, usageRoutes);
app.use(`${API_PREFIX}/audit-logs`, auditRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRouter);
app.use("/health", healthRoutes);
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});
app.use(errorHandler);
export default app;
