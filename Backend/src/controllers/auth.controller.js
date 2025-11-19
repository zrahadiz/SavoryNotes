const { User } = require("../models");

const { comparePassword } = require("../utils/password");
const { generateToken, generateRefreshToken } = require("../utils/jwt");
const { response } = require("../utils/formatResponse");
const { sendEmail } = require("../utils/nodeMailer");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return response(400, false, null, "Email already exists", res);
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      status: "pending",
    });

    await sendEmail(
      email,
      "Your account request has been received",
      `<p>Hi ${name},</p>
       <p>Your account request has been submitted. You will be notified once approved.</p>`
    );

    return response(
      201,
      true,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "Registration submitted. Wait for admin approval.",
      res
    );
  } catch (error) {
    return response(500, false, null, error.message, res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return response(400, false, null, "Invalid Email", res);
    }

    if (user.status === "pending") {
      return response(
        403,
        false,
        null,
        "Your account is still pending approval.",
        res
      );
    }

    if (user.status === "rejected") {
      return response(403, false, null, "Your account has been rejected.", res);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return response(400, false, null, "Invalid Password", res);
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response(
      200,
      true,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "Login successfully",
      res
    );
  } catch (error) {
    return response(500, false, null, error.message, res);
  }
};

const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.json({ message: "Logged out successfully" });
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return response(200, true, user, "User found", res);
  } catch (error) {
    return response(500, false, null, error.message, res);
  }
};

const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Refresh token expired" });
  }
};

const checkAuth = async (req, res) => {
  const accessToken = req.cookies?.accessToken;
  res.json({ loggedIn: !!accessToken });
};

module.exports = {
  register,
  login,
  logout,
  me,
  refreshToken,
  checkAuth,
};
