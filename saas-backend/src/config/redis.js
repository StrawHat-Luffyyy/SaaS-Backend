import Redis from "ioredis";
import { env } from "./env.js";

const redis = new Redis({
  host: env.redisHost ?? "127.0.0.1",
  port: env.redisPort ?? 6379,
  password: env.redisPassword,

  retryStrategy(times) {
    if (times > 5) {
      console.error("Redis retry limit reached. Giving up.");
      return null; // Stop retrying
    }
    return Math.min(times * 200, 2000); // Exponential-ish backoff (ms)
  },

  keyPrefix: `${env.appEnv ?? "dev"}:`,
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err.message)); // Always handle this event

export default redis;
