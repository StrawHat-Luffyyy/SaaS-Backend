import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireOrg } from "../../middlewares/org.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import {
  getSubscription,
  updateSubscription,
} from "./billing.controller.js";

const router = Router();

router.get(
  "/subscription",
  protect,
  requireOrg,
  requireRole(["OWNER", "ADMIN"]),
  getSubscription
);

router.post(
  "/subscription",
  protect,
  requireOrg,
  requireRole(["OWNER"]),
  updateSubscription
);

export default router;
