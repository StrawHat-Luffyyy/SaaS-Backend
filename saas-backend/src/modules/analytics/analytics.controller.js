import Usage from "../billings/usage.model.js";
import Membership from "../orgs/membership.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const month = new Date().toISOString().slice(0, 7); // Get current month in YYYY-MM format
    const [usage, memberCount] = await Promise.all([
      Usage.findOne({ orgId: req.org.id, month }),
      Membership.countDocuments({ orgId: req.org.id }),
    ]);
    res.json({
      orgId: req.org.id,
      period: month,
      metrics: {
        activeUsers: memberCount,
        apiCallsThisMonth: usage ? usage.apiCalls : 0,
        apiCallsLimit: req.plan.limits.apiCallsPerMonth,
        usagePercent:
          req.plan.limits.apiCallsPerMonth === Infinity
            ? 0
            : Math.round(
                ((usage?.apiCalls ?? 0) / req.plan.limits.apiCallsPerMonth) *
                  100,
              ),
      },
      plan: req.plan.name,
    });
  } catch (error) {
    next(error);
  }
};
