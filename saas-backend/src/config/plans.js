export const PLANS = {
  FREE: {
    name: "FREE",
    features: {
      projects: true,
      analytics: false,
    },
    limits: {
      apiCallsPerMonth: 1000,
      members: 3,
    },
  },
  PRO: {
    name: "PRO",
    features: {
      projects: true,
      analytics: true,
    },
    limits: {
      apiCallsPerMonth: 10000,
      members: 10,
    },
  },
};
