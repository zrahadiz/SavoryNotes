const { User } = require("../models");

const { response } = require("../utils/formatResponse");
const { sendEmail } = require("../utils/nodeMailer");

const getPendingUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const users = await User.find({ status: "pending" })
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    response(200, true, users, "Get Pending User Success", res);
  } catch (error) {
    response(500, false, null, error.message, res);
  }
};

const approveUser = async (req, res) => {
  try {
    const { userId, approved } = req.body;
    const adminId = req.user.id; // if using auth middleware

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.status !== "pending")
      return res
        .status(400)
        .json({ message: "User request already responded" });

    if (approved == true) {
      user.status = "approved";
      user.active = true;
    } else {
      user.status = "rejected";
    }
    user.respondedAt = new Date();
    user.respondedBy = adminId;

    await user.save();

    if (approved == true) {
      await sendEmail(
        user.email,
        "Your account has been approved",
        `<p>Congratulations! Your account is now approved.</p>
       <p>You can now login.</p>`
      );
    } else {
      await sendEmail(
        user.email,
        "Your account request was rejected",
        `<p>We're sorry, but your account request was not approved.</p>`
      );
    }

    response(
      200,
      true,
      user,
      approved == true ? "User approved" : "User Rejected",
      res
    );
  } catch (error) {
    response(500, false, null, error.message, res);
  }
};

module.exports = { getPendingUsers, approveUser };
