const mongoose = require("mongoose");

const userSchema = require("./schemas/user.schema");
const postSchema = require("./schemas/post.schema");

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

module.exports = { User, Post };
