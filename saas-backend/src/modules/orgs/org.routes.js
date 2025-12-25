import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { createOrg, getMyOrgs } from "./org.controller.js";
import { requireOrg } from "../../middlewares/org.middleware.js";

const router = Router();

router.post("/", protect, createOrg);
router.get("/", protect, getMyOrgs);
router.get("/protected-resource", protect, requireOrg, (req, res) => {
  res.json({
    message: "You have access to this protected organization resource",
    org: req.org,
  });
});

export default router;
