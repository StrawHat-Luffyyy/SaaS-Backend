import express from "express";
import { getAnalytics } from "./analytics.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireOrg } from "../../middlewares/org.middleware.js";
import { attachPlan } from "../../middlewares/plan.middleware.js";
import { requireFeature } from "../../middlewares/feature.middleware.js";
import { trackApiUsage } from "../../middlewares/usage.middlware.js";
import { rateLimit } from "../../middlewares/rateLimit.middleware.js";

export const router = express.Router();

//The correct order for this route is:
// 1. protect         — is the user authenticated?
// 2. requireOrg      — do they belong to an org?
// 3. attachPlan      — what plan is that org on?
// 4. requireFeature  — does the plan include this feature?
// 5. rateLimit       — have they exceeded requests per minute?
// 6. trackApiUsage   — count this request against their monthly quota
// 7. controller      — finally do the work
router.get(
  "/",
  protect,
  requireOrg,
  attachPlan,
  requireFeature("analytics"),
  rateLimit(60),
  trackApiUsage,
  getAnalytics,
);

export default router;
