const { Schema } = require("mongoose");
const { generateUniqueSlug } = require("../../utils/slug");

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["entree", "breakfast", "lunch", "dinner", "dessert", "quickBites"],
      required: true,
    },
    time: {
      type: Number, // total time (minutes)
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    servings: {
      type: Number,
      default: 1,
    },
    tags: { type: [String], default: [] },
    ingredients: { type: [String], default: [] },
    prepTime: Number,
    cookTime: Number,
    images: [{ type: String }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

postSchema.index({ title: "text", content: "text" });

postSchema.pre("validate", async function (next) {
  if (this.isNew || this.isModified("title")) {
    this.slug = await generateUniqueSlug(
      this.constructor,
      this.title,
      this._id
    );
  }
  next();
});

postSchema.set("runValidators", true);
postSchema.set("validateBeforeSave", true);

module.exports = postSchema;
