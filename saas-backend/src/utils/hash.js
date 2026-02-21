import bcrypt from "bcrypt";

// hashPassword is intentionally removed — hashing is handled
// exclusively by the pre-save hook in user.model.js.
// Centralizing it there makes it impossible to store plaintext
// on any future password update flow.

// comparePassword stays here because it's needed in two places:
// 1. login — comparing submitted password against stored hash
// 2. login — timing-safe dummy compare when user doesn't exist
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};