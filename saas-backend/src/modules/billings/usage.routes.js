import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireOrg } from "../../middlewares/org.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { attachPlan } from "../../middlewares/plan.middleware.js";
import {
  getCurrentUsage,
  getUsageHistory,
} from "./usage.controller.js";

const router = Router();

router.get(
  "/",
  protect,
  requireOrg,
  attachPlan,
  requireRole(["OWNER", "ADMIN"]),
  getCurrentUsage
);

router.get(
  "/history",
  protect,
  requireOrg,
  attachPlan,
  requireRole(["OWNER", "ADMIN"]),
  getUsageHistory
);

export default router;
