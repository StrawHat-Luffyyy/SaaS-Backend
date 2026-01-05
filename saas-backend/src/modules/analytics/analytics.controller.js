export const getAnalytics = async (req, res) => {
  res.json({
    orgId: req.org.id,
    message: "Analytics data for your organization",
    metrics: {
      activeUsers: 12,
      apiCallsThisMonth: 340,
    },
  });
};
