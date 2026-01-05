import AuditLog from "./audit.model.js";

export const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find({
    orgId: req.org.id,
  }).sort({ createdAt: -1 });

  res.json({ logs });
};
