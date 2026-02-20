import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../modules/users/user.model.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, env.accessTokenSecret);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(decoded.userId).select("-password").lean();
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.isDeactivated) {
      return res.status(403).json({ message: "Account has been deactivated" });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired", code: "TOKEN_EXPIRED" });
    }
    return res
      .status(401)
      .json({ message: "Invalid token", code: "TOKEN_INVALID" });
  }
};
