import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  createOrg,
  getMyOrgs,
  inviteUser,
  acceptInvite,
} from "./org.controller.js";
import { requireOrg } from "../../middlewares/org.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { attachPlan } from "../../middlewares/plan.middleware.js";
import { rateLimit } from "../../middlewares/rateLimit.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.post("/", protect, createOrg);
router.get("/", protect, getMyOrgs);

router.use(protect, requireOrg, attachPlan, rateLimit(60));
router.post(
  "/invite",
  protect,
  requireOrg,
  requireRole(["OWNER", "ADMIN"]),
  inviteUser
);
router.post("/invites/:inviteId/accept", protect, acceptInvite);

router.post(
  "/invite",
  protect,
  requireOrg,
  requireRole(["OWNER"]),
  asyncHandler(inviteUser)
);

export default router;
