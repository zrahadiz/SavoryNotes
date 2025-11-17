const slugify = require("slugify");

async function generateUniqueSlug(model, title, currentId = null) {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true, // removes special characters like !@#$%^&*
  });

  let slug = baseSlug;
  let counter = 2;

  // Find if slug already exists
  let existing = await model.findOne({ slug });

  // If updating a post, skip its own ID to prevent false duplicates
  while (existing && existing._id.toString() !== String(currentId)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
    existing = await model.findOne({ slug });
  }

  return slug;
}

module.exports = { generateUniqueSlug };
