const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    role: user.role,
  };

  const secretKey = process.env.JWT_SECRET || "secret_key";

  const options = {
    expiresIn: "2d",
  };

  const token = jwt.sign(payload, secretKey, options);
  return token;
};

const generateRefreshToken = (user) => {
  const payload = {
    id: user._id,
  };
  const secretKey = process.env.REFRESH_TOKEN_SECRET;

  const options = {
    expiresIn: "7d",
  };

  const refreshToken = jwt.sign(payload, secretKey, options);
  return refreshToken;
};

module.exports = { generateToken, generateRefreshToken };
