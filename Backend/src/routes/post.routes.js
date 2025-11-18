const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadImage");
const {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
} = require("../controllers/post.controller");
const { auth, verifyToken } = require("../middlewares/authorization");

router.post(
  "/",
  verifyToken,
  auth("admin"),
  upload.array("images", 5),
  createPost
);

router.get("/", getPosts);
router.get("/:slug", getPostBySlug);
router.put(
  "/:slug",
  verifyToken,
  auth("admin"),
  upload.array("images", 5),
  updatePost
);

module.exports = router;
