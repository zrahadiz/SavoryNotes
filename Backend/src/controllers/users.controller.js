const { User } = require("../models");

const { response } = require("../utils/formatResponse");
const { sendEmail } = require("../utils/sendMail");

const getPendingUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;

    const query = { status: "pending" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      User.countDocuments(query),
    ]);

    const pagination = {
      total: total,
      prev: page > 1 ? page - 1 : null,
      next: page * limit < total ? page + 1 : null,
      max: Math.ceil(total / limit),
    };

    return response(
      200,
      true,
      users,
      "Get Pending User Success",
      res,
      pagination
    );
  } catch (error) {
    return response(500, false, null, error.message, res);
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
