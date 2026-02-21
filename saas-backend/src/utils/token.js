import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import crypto from "crypto";
import redis from "../config/redis.js";

// ---------------------------------------------------------------------------
// Token Generation
// ---------------------------------------------------------------------------

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, env.accessTokenSecret, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, env.refreshTokenSecret, { expiresIn: "7d" });
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Redis key pattern: refreshToken:{userId}:{tokenHash}
// Using userId in the key lets us efficiently revoke ALL tokens for a user
// (e.g. "logout from all devices") with a Redis SCAN on the prefix.
const buildKey = (userId, tokenHash) => `refreshToken:${userId}:${tokenHash}`;

const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days — must match JWT expiry

// ---------------------------------------------------------------------------
// saveRefreshToken
// Called once on login to persist the newly issued refresh token.
// ---------------------------------------------------------------------------

export const saveRefreshToken = async (userId, token) => {
  const tokenHash = hashToken(token);
  const key = buildKey(userId, tokenHash);

  // Store userId as the value — useful if you ever need to look up
  // who owns a token without decoding the JWT first
  await redis.set(key, userId.toString(), "EX", REFRESH_TOKEN_TTL_SECONDS);
};

// ---------------------------------------------------------------------------
// validateStoredRefreshToken
// Called on /refresh to confirm the token hasn't been revoked or rotated away.
// Returns true if valid, false if revoked/missing.
// ---------------------------------------------------------------------------

export const validateStoredRefreshToken = async (userId, token) => {
  const tokenHash = hashToken(token);
  const key = buildKey(userId, tokenHash);

  const storedUserId = await redis.get(key);

  // Double-check the stored userId matches the one in the JWT payload —
  // guards against any key collision edge cases
  return storedUserId === userId.toString();
};

// ---------------------------------------------------------------------------
// revokeRefreshToken
// Called on /logout to invalidate a single token (this device only).
// ---------------------------------------------------------------------------

export const revokeRefreshToken = async (userId, token) => {
  const tokenHash = hashToken(token);
  const key = buildKey(userId, tokenHash);

  await redis.del(key);
};

// ---------------------------------------------------------------------------
// revokeAllRefreshTokens
// Called on logout from all devices — deletes every refresh token for a user.
// Useful for password change, account compromise, or admin deactivation.
// ---------------------------------------------------------------------------

export const revokeAllRefreshTokens = async (userId) => {
  const pattern = `refreshToken:${userId}:*`;

  const keys = [];
  let cursor = "0";

  do {
    const [nextCursor, found] = await redis.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      100,
    );
    cursor = nextCursor;
    keys.push(...found);
  } while (cursor !== "0");

  if (keys.length > 0) {
    await redis.del(...keys);
  }
};
