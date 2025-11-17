const { Post } = require("../models");
const { response } = require("../utils/formatResponse");

const createPost = async (req, res) => {
  try {
    const images = req.files ? req.files.map((f) => f.path) : [];

    const newPost = await Post.create({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : [],
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      images,
      createdBy: req.user?._id,
    });

    response(201, true, newPost, "Post created successfully", res);
  } catch (error) {
    response(500, false, null, error.message, res);
  }
};

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, category, tags, sort } = req.query;

    const query = {};

    if (search) query.$text = { $search: search };
    if (category && category !== "all") query.category = category;
    if (tags) query.tags = { $in: tags.split(",") };

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      az: { title: 1 },
      za: { title: -1 },
    };

    const sorting = sortOptions[sort] || sortOptions.newest;

    const [posts, total] = await Promise.all([
      Post.find(query).skip(skip).limit(limit).sort(sorting),
      Post.countDocuments(query),
    ]);

    const pagination = {
      prev: page > 1 ? page - 1 : null,
      next: page * limit < total ? page + 1 : null,
      max: Math.ceil(total / limit),
    };

    return response(
      200,
      true,
      posts,
      "Posts fetched successfully",
      res,
      pagination
    );
  } catch (error) {
    return response(500, false, null, error.message, res);
  }
};

module.exports = {
  createPost,
  getPosts,
};
