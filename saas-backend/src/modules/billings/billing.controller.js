import Subcription from "./subscription.model.js";

export const getSubscription = async (req, res) => {
  try {
    const subcription = await Subcription.findOne({ orgId: req.org.id });
    if (!subcription) {
      return res.status(404).json({ message: "Subcription not found" });
    }
    return res
      .status(200)
      .json({ message: "Subcription fetched successfully", subcription });
  } catch (error) {
    console.error("Error fetching subcription:", error);
    res.status(500).json({ message: "Internal server errror" });
  }
};

export const updateSubscription = async (req, res) => {
  const { plan, status } = req.body;
  try {
    const subcription = await Subcription.findOneAndUpdate(
      { orgId: req.org._id },
      { plan, status },
      { new: true }
    );
    if (!subcription) {
      return res.status(404).json({ message: "Subcription not found" });
    }
    return res
      .status(200)
      .json({ message: "Subcription updated successfully", subcription });
  } catch (error) {
    console.error("Error updating subcription:", error);
    res.status(500).json({ message: "Internal server errror" });
  }
};
