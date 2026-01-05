// HealthCheck Controller
export const healthCheck = async (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
}