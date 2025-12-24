import User from "../users/user.model.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";
import { env } from "../../config/env.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User exists" });
    const user = await User.create({
      email,
      password: await hashPassword(password),
    });
    return res.status(201).json({ message: "User registered", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid creds" });
    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid creds" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.cookieSecure,
        sameSite: "strict",
        path: "/",
      })
      .json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const me = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }
  try {
    const decoded = jwt.verify(refreshToken, env.refreshTokenSecret);
    const newAccessToken = generateAccessToken(decoded.userId);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "strict",
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
};
