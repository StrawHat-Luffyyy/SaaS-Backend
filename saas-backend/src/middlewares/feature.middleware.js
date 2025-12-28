export const requireFeature = (feature) => {
  return (req, res, next) => {
    if(!req.plan || !req.plan.features[feature]) {
      return res.status(403).json({ message: `Feature "${feature}" is not available on your current plan.` });
    }
    next();
  }
}