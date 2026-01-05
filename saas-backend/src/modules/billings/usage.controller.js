import Usage from "./usage.model.js";

// GET current month's usage
export const getCurrentUsage = async (req, res) => {
  const month = new Date().toISOString().slice(0, 7);

  const usage = await Usage.findOne({
    orgId: req.org.id,
    month,
  });

  if (!usage) {
    return res.json({
      apiCalls: 0,
      limit: req.plan.limits.apiCallsPerMonth,
    });
  }

  res.json({
    apiCalls: usage.apiCalls,
    limit: req.plan.limits.apiCallsPerMonth,
  });
};

// GET usage history
export const getUsageHistory = async (req, res) => {
  const history = await Usage.find({
    orgId: req.org.id,
  }).sort({ month: -1 });

  res.json(history);
};
