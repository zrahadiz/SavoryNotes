const mongoose = require("mongoose");
const { Post } = require("../models");
const { User } = require("../models");
require("dotenv").config();

const seedPosts = [
  {
    title: "Creamy Garlic Parmesan Chicken",
    description: "A rich, creamy chicken recipe perfect for weeknight meals.",
    content:
      "1. Season the chicken.\n2. Sear in a pan.\n3. Add garlic, cream, and parmesan.\n4. Cook until thick and creamy.",
    category: "dinner",
    difficulty: "medium",
    servings: 4,
    time: 35,
    prepTime: 10,
    cookTime: 25,
    tags: ["creamy", "chicken", "parmesan"],
    ingredients: [
      "500g chicken breast",
      "3 cloves garlic",
      "1 cup heavy cream",
      "Parmesan cheese",
      "Salt",
      "Pepper",
    ],
    images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
  },
  {
    title: "Fluffy Banana Pancakes",
    description:
      "Sweet and fluffy pancakes made with ripe bananas. Perfect breakfast!",
    content:
      "1. Mash banana.\n2. Mix with flour, milk, and eggs.\n3. Cook on low heat.\n4. Serve warm.",
    category: "breakfast",
    difficulty: "easy",
    servings: 2,
    time: 20,
    prepTime: 5,
    cookTime: 15,
    tags: ["breakfast", "pancakes", "banana"],
    ingredients: [
      "2 ripe bananas",
      "1 cup flour",
      "2 eggs",
      "½ cup milk",
      "Butter",
    ],
    images: ["https://res.cloudinary.com/demo/image/upload/banana.jpg"],
  },
  {
    title: "Spicy Stir-Fried Noodles",
    description: "Quick and delicious spicy noodles. A perfect quick bite.",
    content:
      "1. Boil noodles.\n2. Stir-fry garlic and chili.\n3. Add vegetables.\n4. Mix noodles and sauce.",
    category: "quickBites",
    difficulty: "easy",
    servings: 1,
    time: 15,
    prepTime: 5,
    cookTime: 10,
    tags: ["noodles", "spicy", "quick"],
    ingredients: ["Instant noodles", "Chili paste", "Garlic", "Soy sauce"],
    images: ["https://res.cloudinary.com/demo/image/upload/noodles.jpg"],
  },
  {
    title: "Classic Chocolate Cake",
    description: "A moist, rich chocolate cake topped with silky frosting.",
    content:
      "1. Mix dry ingredients.\n2. Add milk and eggs.\n3. Bake at 180°C.\n4. Frost with chocolate ganache.",
    category: "dessert",
    difficulty: "medium",
    servings: 8,
    time: 60,
    prepTime: 20,
    cookTime: 40,
    tags: ["cake", "chocolate", "dessert"],
    ingredients: ["Flour", "Cocoa powder", "Eggs", "Milk", "Sugar", "Butter"],
    images: ["https://res.cloudinary.com/demo/image/upload/choco-cake.jpg"],
  },
];

async function runSeeder() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("👉 Connected to MongoDB");

    const user = await User.findOne();
    if (!user) {
      throw new Error("No users found in DB — create at least 1 user first.");
    }

    const postsWithUser = seedPosts.map((post) => ({
      ...post,
      createdBy: user._id,
    }));

    await Post.deleteMany({});
    console.log("🗑 Cleared existing posts");

    await Post.insertMany(postsWithUser);
    console.log("✅ Posts seeded successfully!");

    process.exit();
  } catch (err) {
    console.error("❌ Seeder Error:", err.message);
    process.exit(1);
  }
}

runSeeder();
