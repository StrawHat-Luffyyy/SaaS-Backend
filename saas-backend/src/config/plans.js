export const PLANS = Object.freeze({
  FREE: Object.freeze({
    name: "FREE",
    price: 0,
    features: Object.freeze({
      projects: true,
      analytics: false,
    }),
    limits: Object.freeze({
      apiCallsPerMonth: 1000,
      members: 3,
    }),
  }),
  PRO: Object.freeze({
    name: "PRO",
    price: 29, // USD/month — placeholder
    features: Object.freeze({
      projects: true,
      analytics: true,
    }),
    limits: Object.freeze({
      apiCallsPerMonth: 10000,
      members: 10,
    }),
  }),
  ENTERPRISE: Object.freeze({
    name: "ENTERPRISE",
    price: null, // Custom pricing
    features: Object.freeze({
      projects: true,
      analytics: true,
    }),
    limits: Object.freeze({
      apiCallsPerMonth: Infinity,
      members: Infinity,
    }),
  }),
});

export const getPlan = (planName) => PLANS[planName] ?? PLANS.FREE;
