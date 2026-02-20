import Usage from "../modules/billings/usage.model.js";

export const trackApiUsage = async (req, res, next) => {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM format

  try {
    const existing = await Usage.findOne({ orgId: req.org.id, month }).lean();
    if (existing && existing.apiCalls >= req.plan.limits.apiCallsPerMonth) {
      return res.status(429).json({
        message: "API call limit exceeded for your plan.",
        limit: req.plan.limits.apiCallsPerMonth,
        current: existing.apiCalls,
        // Tell the client when the limit resets
        resetsOn: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          1,
        ),
      });
    }
    await Usage.findOneAndUpdate(
      { orgId: req.org.id, month },
      { $inc: { apiCalls: 1 } },
      { upsert: true, new: true },
    );
    req.usage = {
      current: (existing?.apiCalls ?? 0) + 1,
      limit: req.plan.limits.apiCallsPerMonth,
    };
    next();
  } catch (error) {
    console.error("Error tracking API usage:", error);
    next(error);
  }
};
