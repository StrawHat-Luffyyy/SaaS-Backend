import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireOrg } from "../../middlewares/org.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { getAuditLogs } from "./audit.controller.js";

const router = Router();

router.get(
  "/",
  protect,
  requireOrg,
  requireRole(["OWNER", "ADMIN"]),
  getAuditLogs
);

export default router;
