export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.org || !req.org.role) {
      return res.status(403).json({ message: "Access denied. No role found." });
    }
    if (allowedRoles.length === 0) {
      console.warn(
        "requireRole called with no allowed roles — all requests will be denied",
      );
    }
    if (!allowedRoles.includes(req.org.role)) {
      return res
        .status(403)
        .json({
          message: "Access denied. Insufficient permissions.",
          requiredRoles: allowedRoles,
          userRole: req.org.role,
        });
    }
    next();
  };
};
