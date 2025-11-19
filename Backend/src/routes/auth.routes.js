const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  me,
  refreshToken,
  checkAuth,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/authorization");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", verifyToken, me);
router.get("/check", checkAuth);

module.exports = router;
