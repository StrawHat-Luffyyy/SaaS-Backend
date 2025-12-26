import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { createOrg, getMyOrgs, inviteUser  , acceptInvite} from "./org.controller.js";
import { requireOrg } from "../../middlewares/org.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.post("/", protect, createOrg);
router.get("/", protect, getMyOrgs);
router.get("/protected-resource", protect, requireOrg, (req, res) => {
  res.json({
    message: "You have access to this protected organization resource",
    org: req.org,
  });
});
router.post("/invite", protect, requireOrg, requireRole(["OWNER", "ADMIN"]), inviteUser);
router.post("/invites/:inviteId/accept", protect, acceptInvite);

export default router;
