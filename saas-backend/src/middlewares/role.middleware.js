export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.org || !req.org.role) {
      return res.status(403).json({ message: "Access denied. No role found." });
    }
    if (!allowedRoles.includes(req.org.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};
