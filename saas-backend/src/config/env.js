import dotenv from "dotenv";
dotenv.config();

const required = ["MONGO_URI", "ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: process.env.PORT ?? 3000,
  mongoUri: process.env.MONGO_URI,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  cookieSecure: process.env.COOKIE_SECURE === "true",

  redisHost: process.env.REDIS_HOST,
  redisPort: parseInt(process.env.REDIS_PORT ?? "6379", 10),
  redisPassword: process.env.REDIS_PASSWORD,
  appEnv: process.env.NODE_ENV ?? "development",
};
