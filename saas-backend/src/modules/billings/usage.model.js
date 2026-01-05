import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    month: {
      type: String, // YYYY-MM
      required: true,
    },
    apiCalls: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Prevent duplicate rows for same org + month
usageSchema.index({ orgId: 1, month: 1 }, { unique: true });

export default mongoose.model("Usage", usageSchema);
