import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import { comparePassword } from "../../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  validateStoredRefreshToken,
  revokeRefreshToken,
} from "../../utils/token.js";
import { env } from "../../config/env.js";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: "strict",
  path: "/api/v1/auth/refresh",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /register
// ─────────────────────────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  try {
    const exists = await User.findOne({ email }).lean();
    if (exists) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({ email, password });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /login
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    const DUMMY_HASH =
      "$2b$12$invalidhashfortimingpurposesonly.................";
    const valid = await comparePassword(
      password,
      user ? user.password : DUMMY_HASH,
    );

    if (!user || !valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isDeactivated) {
      return res
        .status(403)
        .json({ message: "Account is deactivated. Please contact support." });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await saveRefreshToken(user._id, refreshToken);

    return res
      .cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS)
      .status(200)
      .json({
        accessToken,
        user: {
          _id: user._id,
          email: user.email,
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /me
// ─────────────────────────────────────────────────────────────────────────────
export const me = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /refresh
// ─────────────────────────────────────────────────────────────────────────────
export const refreshToken = async (req, res, next) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(token, env.refreshTokenSecret);

    const isValid = await validateStoredRefreshToken(decoded.userId, token);
    if (!isValid) {
      res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
      return res.status(401).json({
        message: "Refresh token has been revoked",
        code: "REFRESH_REVOKED",
      });
    }

    // Rotate — old token revoked, new token issued and saved
    await revokeRefreshToken(decoded.userId, token);

    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);
    await saveRefreshToken(decoded.userId, newRefreshToken);

    return res
      .cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS)
      .status(200)
      .json({ accessToken: newAccessToken });
  } catch (error) {
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Refresh token expired", code: "REFRESH_EXPIRED" });
    }
    return res
      .status(401)
      .json({ message: "Invalid refresh token", code: "REFRESH_INVALID" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /logout
// ─────────────────────────────────────────────────────────────────────────────
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await revokeRefreshToken(req.user._id, token);
    }

    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
