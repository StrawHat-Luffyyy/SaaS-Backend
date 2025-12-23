import User from "../users/user.model.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";
import { env } from "../../config/env.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password)
    return res.status(400).json({ message: "Email and password are required" });
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User exists" });
    const user = await User.create({
      email,
      password: hashPassword(password),
    });
    return res.status(201).json({ message: "User registered", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password)
    return res.status(400).json({ message: "Email and password are required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid creds" });
    const valid = comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid creds" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.cookieSecure,
      })
      .json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
