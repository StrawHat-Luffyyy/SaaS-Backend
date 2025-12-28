import Usage from "../modules/billings/usage.model.js";

export const trackApiUsage = async (req, res, next) => {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM format

  try {
    const usage = await Usage.findOne(
      { orgId: req.orgId, month },
      { $inc: { apiCalls: 1 } },
      { upsert: true, new: true }
    );
    if (usage.apiCalls > req.plan.limits.apiCallsPerMonth) {
      return res
        .status(403)
        .json({ message: "API call limit exceeded for your plan." });
    }
  } catch (error) {}
};
