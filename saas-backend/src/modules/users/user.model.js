import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never returned in queries unless explicitly .select("+password")
    },

    isDeactivated: {
      type: Boolean,
      default: false,
    },

    deactivatedAt: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    refreshTokenVersion: {
      type: Number,
      default: 0,
    },

    orgs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Org",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        // Safety net — even if select:false is somehow bypassed,
        // password never appears in res.json(user)
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────────────────────────────────────

userSchema.index({ email: 1 });
userSchema.index({ isDeactivated: 1, createdAt: -1 });

// ─────────────────────────────────────────────────────────────────────────────
// Pre-save Hook — only source of password hashing in the entire codebase
// ─────────────────────────────────────────────────────────────────────────────

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// Instance Methods
// ─────────────────────────────────────────────────────────────────────────────

// Used in login — query must use .select("+password") for this to work
userSchema.methods.comparePassword = async function (plaintext) {
  if (!this.password) {
    throw new Error(
      "Password field not loaded — add .select('+password') to this query",
    );
  }
  return bcrypt.compare(plaintext, this.password);
};

userSchema.methods.deactivate = async function () {
  this.isDeactivated = true;
  this.deactivatedAt = new Date();
  return this.save();
};

export default mongoose.model("User", userSchema);
