import Organization from "./org.model.js";
import Membership from "./membership.model.js";

export const createOrg = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Organization name is required" });
  }
  const userId = req.user._id;
  try {
    const org = await Organization.create({ 
      name,
      ownerId: userId 
    });
    await Membership.create({
      userId,
      orgId: org._id,
      role: "OWNER",
    });
    res.status(201).json(org);
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getMyOrgs = async (req, res) => {
  const membership = await Membership.find({
    userId: req.user._id
  }).populate('orgId');

  res.json({organizations : membership})
}
