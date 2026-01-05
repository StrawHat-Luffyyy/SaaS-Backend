import express from "express";
import {
  getAnalytics, 
} from "./analytics.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireOrg } from "../../middlewares/org.middleware.js";
import { attachPlan } from "../../middlewares/plan.middleware.js";
import { requireFeature } from "../../middlewares/feature.middleware.js";
import { trackApiUsage } from "../../middlewares/apiUsage.middleware.js";
import { rateLimit } from "../../middlewares/rateLimit.middleware.js";

export const router = express.Router();

router.get(
  "/analytics",
  protect,
  requireOrg,
  attachPlan,
  requireFeature("analytics"),
  trackApiUsage,
  rateLimit(60),
  getAnalytics
);

export default router;