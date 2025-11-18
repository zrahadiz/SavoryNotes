const { Post } = require("../models");
const { response } = require("../utils/formatResponse");

const createPost = async (req, res) => {
  try {
    const images = req.files ? req.files.map((f) => f.path) : [];

    const newPost = await Post.create({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      category: req.body.category,
      time: req.body.time,
      difficulty: req.body.difficulty,
      servings: req.body.servings,
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

const updatePost = async (req, res) => {
  try {
    // Existing URLs from the client (still want to keep)
    const existingImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : [];

    // New images uploaded
    const newImages = req.files ? req.files.map((f) => f.path) : [];

    // Merge old + new
    const images = [...existingImages, ...newImages];

    const tags = req.body.tags ? JSON.parse(req.body.tags) : undefined;
    const ingredients = req.body.ingredients
      ? JSON.parse(req.body.ingredients)
      : undefined;

    const updateData = {
      ...req.body,
      images, // ALWAYS include merged result
      ...(tags ? { tags } : {}),
      ...(ingredients ? { ingredients } : {}),
    };

    const updated = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      updateData,
      { new: true }
    );

    if (!updated) return response(404, false, null, "Post not found", res);

    response(200, true, updated, "Post updated", res);
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

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

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

const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      return response(404, false, null, "Post Not Found", res);
    }

    response(200, true, post, "Post retieved", res);
  } catch (error) {
    return response(500, false, null, error.message, res);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });

    if (!post) {
      return response(404, false, null, "Post not found", res);
    }

    response(200, true, null, "Post deleted successfully", res);
  } catch (error) {
    response(500, false, null, error.message, res);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
};
