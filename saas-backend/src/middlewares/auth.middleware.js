import jwt from "jsonwebtoken"
import {env} from "../config/env.js"
import User from "../modules/users/user.model.js"


export const protect = async (req , res , next ) => {
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token , env.accessTokenSecret);
    if(!decoded){
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(decoded.userId);
    if(!user){
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next()
  } catch (error) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
}