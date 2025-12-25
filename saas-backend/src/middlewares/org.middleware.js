import Membership from "../modules/orgs/membership.model.js";

export const requireOrg = async (req, res, next) => {
  const orgId = req.headers["x-org-id"];
  try {
    if (!orgId) {
      return res
        .status(400)
        .json({ message: "Organization ID header is required" });
    }
    const membership = await Membership.findOne({
      userId: req.user._id,
      orgId: orgId,
    });
    if (!membership) {
      return res
        .status(403)
        .json({ message: "Access to this organization is forbidden" });
    }
    req.org = {
      id: orgId,
      role: membership.role,
    };
    next();
  } catch (error) {
    console.error("Error in requireOrg middleware:", error);
  }
};
