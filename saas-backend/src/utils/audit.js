import AuditLog from "../modules/audit/audit.model.js";

export const logAudit = async ({ orgId, userId, action, meta }) => {
  try {
    await AuditLog.create({
      orgId,
      userId,
      action,
      meta,
    });
  } catch (error) {
    console.error("Failed to log audit:", error);
  }
};
