import redis from "../config/redis.js";

export const rateLimit = (limit = 100) => {
  return async (req, res, next) => {
    const window = Math.floor(Date.now() / 60000); // Current time in minutes
    const key = `rate:${req.org.id}`;
    try {
      const [count] = await redis.pipeline().incr(key).expire(key, 60).exec();
      const currentCount = count[1];
      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - currentCount));
      if (currentCount > limit) {
        return res.status(429).json({
          message: "Too many requests. Please try again later.",
          retryAfter: 60,
        });
      }
      next();
    } catch (error) {
      console.error("Error in rateLimit middleware:", error);
      next(error);
    }
  };
};
