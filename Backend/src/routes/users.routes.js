const express = require("express");
const router = express.Router();

const { verifyToken, auth } = require("../middlewares/authorization");
const {
  getPendingUsers,
  approveUser,
} = require("../controllers/users.controller");

router.get("/pending", verifyToken, auth("admin"), getPendingUsers);
router.post("/approve", verifyToken, auth("admin"), approveUser);

module.exports = router;
