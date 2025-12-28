import Subscription from "../modules/billings/subscription.model.js";
import { PLANS } from "../config/plans.js";

export const attachPlan = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ orgId: req.org.id });
    if (!sub || sub.status !== "ACTIVE") {
      return res
        .status(403)
        .json({
          message: "No active subscription found for this organization.",
        });
    }
    req.plan = PLANS[sub.plan];
    next();
  } catch (error) {
    console.error("Error in plan middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
