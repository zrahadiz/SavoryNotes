const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadImage");
const { createPost, getPosts } = require("../controllers/post.controller");
const { auth, verifyToken } = require("../middlewares/authorization");

router.post(
  "/",
  verifyToken,
  auth("admin"),
  upload.array("images", 5),
  createPost
);

router.get("/", verifyToken, getPosts);

module.exports = router;
