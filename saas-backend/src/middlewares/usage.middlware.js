import Usage from "../modules/billings/usage.model.js";

export const trackApiUsage = async (req, res, next) => {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM format

  try {
    const usage = await Usage.findOneAndUpdate(
      { orgId: req.org.id, month },
      { $inc: { apiCalls: 1 } },
      { upsert: true, new: true }
    );
    if (usage.apiCalls > req.plan.limits.apiCallsPerMonth) {
      return res
        .status(429)
        .json({ message: "API call limit exceeded for your plan." });
    }
    next();
  } catch (error) {
    console.error("Error tracking API usage:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
