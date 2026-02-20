export const requireFeature = (feature) => {
  return (req, res, next) => {
    if (!req.plan) {
      return res.status(500).json({
        message: "Server misconfiguration: plan not attached to request",
      });
    }

    //check — if someone passes a feature
    // name like "constructor" or "__proto__" it could cause unexpected behavior
    const hasFeature =
      Object.prototype.hasOwnProperty.call(req.plan.features, feature) &&
      req.plan.features[feature] === true;

    if (!hasFeature) {
      return res.status(403).json({
        message: `Feature "${feature}" is not available on your current plan.`,
        // Tell the client what plan they need to upgrade to
        upgradeRequired: true,
      });
    }

    next();
  };
};
