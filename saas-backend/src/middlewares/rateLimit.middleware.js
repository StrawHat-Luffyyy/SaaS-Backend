import redis from "../config/redis.js";

export const rateLimit = (limit = 100) => {
  return async (req, res, next) => {
    const key = `rate:${req.org.id}`;

    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, 60); // Set TTL of 60 seconds
    }

    if (count > limit) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    }
    next();
  };
};
