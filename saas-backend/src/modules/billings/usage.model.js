import mongoose from "mongoose";

const UsageSchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      month: String,
      apiCalls: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Usage", UsageSchema);
