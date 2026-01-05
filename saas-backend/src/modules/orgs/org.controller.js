import Organization from "./org.model.js";
import Membership from "./membership.model.js";
import Invite from "./invite.model.js";
import Subscription from "../billings/subscription.model.js";
import AuditLog from "../audit/audit.model.js";
import { logAudit } from "../../utils/audit.js";

export const createOrg = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Organization name is required" });
  }
  const userId = req.user._id;
  try {
    const org = await Organization.create({
      name,
      ownerId: userId,
    });
    await Membership.create({
      userId,
      orgId: org._id,
      role: "OWNER",
    });
    await Subscription.create({
      orgId: org._id,
      plan: "FREE",
      status: "ACTIVE",
    });
    res.status(201).json(org);
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyOrgs = async (req, res) => {
  const membership = await Membership.find({
    userId: req.user._id,
  }).populate("orgId");

  res.json({ organizations: membership });
};

export const inviteUser = async (req, res) => {
  const { email, role } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const invite = await Invite.create({
      email,
      role: role || "MEMBER",
      orgId: req.org.id,
      invitedBy: req.user._id,
    });

    await logAudit({
      orgId: req.org.id,
      userId: req.user.id,
      action: "INVITE_USER",
      meta: { email, role },
    });
    res.status(201).json({
      message: "User invited successfully",
      invite,
    });
  } catch (error) {
    console.error("Error inviting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptInvite = async (req, res) => {
  const { inviteId } = req.params;
  try {
    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }
    await Membership.create({
      userId: req.user._id,
      orgId: invite.orgId,
      role: invite.role,
    });
    await logAudit({
      orgId: invite.orgId,
      userId: req.user.id,
      action: "ACCEPT_INVITE",
      meta: {
        role: invite.role,
      },
    });

    await Invite.findByIdAndDelete(inviteId);
    res.json({ message: "Joined organization successfully" });
  } catch (error) {
    console.error("Error accepting invite:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find({
    orgId: req.org.id,
  }).sort({ createdAt: -1 });

  res.json({ logs });
};
