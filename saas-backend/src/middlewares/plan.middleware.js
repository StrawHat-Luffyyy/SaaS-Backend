import Subscription from "../modules/billings/subscription.model.js";
import { PLANS } from "../config/plans.js";

export const attachPlan = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ orgId: req.org.id }).lean();
    if (!sub || sub.status !== "ACTIVE") {
      return res.status(403).json({
        message: "No active subscription found for this organization.",
        code: "NO_ACTIVE_SUBSCRIPTION",
      });
    }
    const plan = PLANS[sub.plan];
    if (!plan) {
      console.error(
        `Unknown plan: ${sub.plan} for the organization ${req.org.id}`,
      );
      return res
        .status(500)
        .json({ message: "Invalid subscription plan configuration" });
    }
    req.plan = plan;
    req.subscription = sub;
    next();
  } catch (error) {
    console.error("Error in plan middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
