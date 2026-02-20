export const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  } else {
    console.error(`[${req.method}] ${req.path} — ${err.message}`);
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",

    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
