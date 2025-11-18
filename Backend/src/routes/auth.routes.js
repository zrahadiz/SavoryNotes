const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  me,
  refreshToken,
} = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/authorization");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/me", verifyToken, me);

module.exports = router;
