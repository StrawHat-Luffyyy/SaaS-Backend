import { Router } from "express";
import {
  register,
  login,
  me,
  refreshToken,
  logout,
} from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", protect, me);
router.post("/refresh", authLimiter, refreshToken);
router.post("/logout", protect, logout);

export default router;
