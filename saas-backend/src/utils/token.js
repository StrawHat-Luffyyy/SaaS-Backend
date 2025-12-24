import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, env.accessTokenSecret, {
    expiresIn: "15m",
  });
};
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, env.refreshTokenSecret, {
    expiresIn: "7d",
  });
};
