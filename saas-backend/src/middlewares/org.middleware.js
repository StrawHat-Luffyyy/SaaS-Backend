import Membership from "../modules/orgs/membership.model.js";

export const requireOrg = async (req, res, next) => {
  const orgId = req.headers["x-org-id"];
  if (!orgId) {
    return res
      .status(400)
      .json({ message: "Organization ID header is required" });
  }
  if (!orgId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid organization ID format" });
  }
  try {
    const membership = await Membership.findOne({
      userId: req.user._id,
      orgId: orgId,
    }).lean();
    if (!membership) {
      return res
        .status(403)
        .json({ message: "Access to this organization is forbidden" });
    }
    req.org = {
      id: orgId,
      role: membership.role,
      membership,
    };
    next();
  } catch (error) {
    console.error("Error in requireOrg middleware:", error);
    next(error);
  }
};
