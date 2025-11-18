const mongoose = require("mongoose");
const { Post } = require("../models");
const { User } = require("../models");
require("dotenv").config();

const seedPosts = [
  // 2. Overnight Oats with Chia and Berries (Breakfast - Easy)
  {
    title: "No-Cook Blueberry Chia Overnight Oats",
    description:
      "The ultimate healthy, grab-and-go breakfast! Prep these in 5 minutes the night before and enjoy a creamy, satisfying meal straight from the fridge.",
    content:
      "Say goodbye to morning rush and hello to the easiest breakfast ever! In a medium-sized jar (like a Mason jar), combine the rolled oats, milk, chia seeds, maple syrup, and vanilla extract. Stir well to make sure there are no clumps of chia seeds stuck at the bottom—this is important for texture! Gently fold in the fresh or frozen blueberries. Place the lid on the jar and refrigerate for at least 6 hours, but ideally overnight. The oats and chia seeds will absorb the liquid, creating a thick, pudding-like consistency. In the morning, give it a quick stir. If the mixture is too thick, add a splash of milk. Top with your favorite additions—I love a spoonful of nut butter and extra berries! This recipe scales easily, so feel free to make a batch for the whole week.",
    category: "breakfast",
    time: 5,
    difficulty: "easy",
    servings: 1,
    tags: ["vegan", "healthy", "meal-prep", "cold-breakfast", "oats"],
    ingredients: [
      "1/2 cup rolled oats",
      "1 cup almond milk (or dairy milk)",
      "1 tbsp chia seeds",
      "1 tbsp maple syrup",
      "1/2 tsp vanilla extract",
      "1/4 cup blueberries",
    ],
    prepTime: 5,
    cookTime: 0,
    images: ["https://example.com/images/overnight-oats-jar.jpg"],
  },

  // 3. Authentic Sundubu Jjigae (Entree - Hard)
  {
    title: "Authentic Sundubu Jjigae (Spicy Soft Tofu Stew)",
    description:
      "A comforting, spicy Korean stew made with silken soft tofu, vegetables, and a savory seafood broth base. Intense flavor and wonderful heat!",
    content:
      "This traditional Korean stew, *Sundubu Jjigae*, is pure comfort food that is surprisingly easy to master, though it requires specific ingredients. **Make the Chili Oil Base:** In a clay pot (or small pot), heat sesame oil. Sauté the chopped onion and minced garlic for 1 minute. Stir in the gochugaru (chili flakes) until the oil turns a deep red. Add the chopped kimchi and sauté for 2 minutes. **Build the Stew:** Pour in the anchovy broth (or preferred broth). Bring to a rolling boil. Add sliced zucchini and mushrooms, reducing the heat slightly and simmering for 15 minutes to let the flavors meld. **Add Tofu:** Very gently spoon in the soft tofu (do not cut it) and add any seafood. **CRUCIAL STEP:** Do not stir aggressively—this will break up the delicate tofu. Let it simmer until the seafood is cooked through. Crack one egg directly into the center of the stew just before serving. The residual heat will cook the egg perfectly. Serve piping hot with a bowl of steamed white rice and *banchan* (side dishes).",
    category: "entree",
    time: 60,
    difficulty: "hard",
    servings: 3,
    tags: ["korean", "spicy", "stew", "comfort-food", "tofu", "winter"],
    ingredients: [
      "1 package silken soft tofu",
      "2 cups anchovy broth or vegetable broth",
      "1/2 cup chopped kimchi",
      "2 tbsp gochugaru (Korean chili flakes)",
      "1 small onion, chopped",
      "1/2 zucchini, sliced",
      "3 shiitake mushrooms, sliced",
      "1 tsp minced garlic",
      "1 egg",
      "1 tbsp sesame oil",
      "Optional: Shrimp or clams",
    ],
    prepTime: 20,
    cookTime: 40,
    images: ["https://example.com/images/sundubu-jjigae-bowl.jpg"],
  },

  // 4. Fudgy Sea Salt Brownies (Dessert - Medium)
  {
    title: "Fudgy Brownies with Flaky Sea Salt",
    description:
      "The perfect brownie: thick, fudgy, chewy edges, and topped with flaky sea salt to cut the sweetness. Seriously addictive!",
    content:
      "Forget cakey brownies; we are aiming for pure, decadent fudge! Preheat your oven to 350°F (175°C) and line an 8x8 inch pan with parchment paper, leaving an overhang. **Melt the Base:** In a saucepan over low heat, melt the butter and cocoa powder together, stirring until smooth. Remove from heat and stir in the sugar until completely dissolved. **The Eggs:** Whisk in the eggs one at a time, followed by the vanilla. Whisking vigorously for about 30 seconds after the last egg creates that beautiful, thin, shiny crust on top—that’s the second secret! **The Dry Mix:** Gently fold in the flour and salt until *just* combined—a few streaks of flour are fine. Pour the batter into the prepared pan. Bake for 25-30 minutes. The edges should look set, but the center should still look slightly underbaked and wobbly. **Cooling is Crucial:** Let the brownies cool completely in the pan before cutting (at least 2 hours!). Right before serving, sprinkle with flaky sea salt.",
    category: "dessert",
    time: 45,
    difficulty: "medium",
    servings: 9,
    tags: ["chocolate", "baking", "sweet", "fudge", "easy-dessert"],
    ingredients: [
      "1 cup unsalted butter",
      "3/4 cup unsweetened cocoa powder",
      "1 1/2 cups granulated sugar",
      "3 large eggs",
      "1 tsp vanilla extract",
      "3/4 cup all-purpose flour",
      "1/2 tsp salt (for batter)",
      "Flaky sea salt (for topping)",
    ],
    prepTime: 15,
    cookTime: 30,
    images: ["https://example.com/images/sea-salt-brownies.jpg"],
  },

  // 5. 5-Minute Mediterranean Tuna Melt (QuickBites - Easy)
  {
    title: "5-Minute Mediterranean Tuna Melt on Sourdough",
    description:
      "A healthier, brighter take on the classic tuna melt, featuring sun-dried tomatoes, capers, and fresh herbs. Perfect for a lightning-fast lunch!",
    content:
      "This isn’t your average school cafeteria tuna melt! It’s elevated and incredibly fast. First, drain the canned tuna well. In a small bowl, mix the tuna, mayonnaise, chopped sun-dried tomatoes, capers, and a pinch of dried oregano. Season with salt and pepper. Spread the tuna salad evenly over one slice of sourdough bread. Top the tuna mixture with a slice of provolone or mozzarella cheese. Place the open-faced sandwich on a baking sheet. Broil on high for 3-5 minutes, watching *very* closely, until the cheese is melted, bubbly, and lightly golden brown. If you don't have a broiler, you can toast it in a toaster oven. Serve immediately. Pair it with a simple side salad for a complete, delightful meal.",
    category: "quickBites",
    time: 5,
    difficulty: "easy",
    servings: 1,
    tags: ["lunch", "sandwich", "mediterranean", "high-protein", "fast"],
    ingredients: [
      "1 can (5 oz) tuna in water, drained",
      "1 tbsp mayonnaise",
      "1 tbsp chopped sun-dried tomatoes",
      "1 tsp capers, drained",
      "Pinch of dried oregano",
      "1 slice sourdough bread",
      "1 slice provolone or mozzarella cheese",
    ],
    prepTime: 3,
    cookTime: 2,
    images: ["https://example.com/images/tuna-melt-sourdough.jpg"],
  },

  // 6. Classic French Onion Soup (Lunch - Hard)
  {
    title:
      "Deeply Flavorful Classic French Onion Soup (Soupe à l'Oignon Gratinée)",
    description:
      "The ultimate cold-weather soup! Rich beef broth, intensely sweet caramelized onions, topped with a cheesy, toasted baguette slice.",
    content:
      "The key to this masterpiece is patience! **Caramelize the Onions:** Melt the butter in a large Dutch oven or heavy-bottomed pot over medium-low heat. Add the thinly sliced onions. This is the **hardest part** (and where the time goes): stir frequently for 45-60 minutes until the onions are deep golden brown and jammy. They must not burn! Stir in the flour and cook for 1 minute. **Deglaze:** Pour in the sherry (or wine) and scrape up any brown bits from the bottom. Pour in the beef broth, add the bay leaf and thyme, and bring to a simmer. Let it simmer gently for 20 minutes. **Serve:** Discard the bay leaf. Ladle the soup into oven-safe bowls. Place one slice of toasted baguette (rubbed with garlic) on top of the soup. Cover generously with grated Gruyère cheese. Broil for 2-3 minutes until the cheese is melted and bubbly. Handle the hot bowls carefully and serve immediately.",
    category: "lunch",
    time: 90,
    difficulty: "hard",
    servings: 6,
    tags: ["soup", "french", "comfort-food", "winter", "beef-broth"],
    ingredients: [
      "4 large yellow onions, thinly sliced",
      "4 tbsp unsalted butter",
      "1 tsp all-purpose flour",
      "1/2 cup dry sherry or red wine",
      "6 cups beef broth",
      "1 bay leaf",
      "1 tsp fresh thyme leaves",
      "6 slices baguette, toasted",
      "1 1/2 cups grated Gruyère cheese",
    ],
    prepTime: 10,
    cookTime: 80,
    images: ["https://example.com/images/french-onion-soup.jpg"],
  },

  // 7. Sheet Pan Chicken Fajitas (Dinner - Easy)
  {
    title: "One-Pan Weeknight Chicken Fajitas",
    description:
      "Minimal clean-up, maximum flavor! Tossed in a smoky seasoning, this entire Mexican favorite cooks on one sheet pan in under 30 minutes.",
    content:
      "Weeknight cooking just got effortless! Preheat your oven to 400°F (200°C). Slice the chicken breasts into thin strips and slice all your bell peppers and onion into strips. In a large bowl, toss the chicken and vegetables with olive oil, chili powder, cumin, paprika, and a big pinch of salt and pepper until everything is evenly coated. Spread the mixture in a single layer on a large, rimmed baking sheet. **Bake:** Pop it in the oven for 20-25 minutes, or until the chicken is cooked through and the vegetables are tender-crisp. You can give it a quick toss halfway through. **Serve:** Right before serving, squeeze a little fresh lime juice over the top for brightness. Serve piping hot with warm tortillas and your favorite toppings like sour cream, salsa, guacamole, and cilantro.",
    category: "dinner",
    time: 30,
    difficulty: "easy",
    servings: 4,
    tags: ["mexican", "weeknight", "one-pan", "chicken", "spicy"],
    ingredients: [
      "1.5 lbs chicken breasts, sliced",
      "3 bell peppers (various colors), sliced",
      "1 large red onion, sliced",
      "2 tbsp olive oil",
      "2 tsp chili powder",
      "1 tsp cumin",
      "1 tsp paprika",
      "Salt and pepper",
      "Fresh lime juice",
      "Tortillas and toppings",
    ],
    prepTime: 10,
    cookTime: 20,
    images: ["https://example.com/images/sheet-pan-fajitas.jpg"],
  },

  // 8. No-Bake Key Lime Pie Bars (Dessert - QuickBites)
  {
    title: "Quick No-Bake Key Lime Pie Bars",
    description:
      "All the tangy, creamy flavor of Key Lime Pie without ever turning on the oven! A perfect refreshing treat for hot weather.",
    content:
      "This dessert is unbelievably easy and requires zero baking! **The Crust:** In a bowl, mix the graham cracker crumbs and melted butter until sandy. Press the mixture firmly into the bottom of an 8x8 inch pan lined with parchment paper. Place the pan in the freezer to chill while you make the filling. **The Filling:** In a large bowl, whisk together the sweetened condensed milk, fresh key lime juice, and zest until the mixture thickens slightly. The acid in the lime juice will do the work here! Pour the filling over the chilled crust. **Set:** Cover the pan and refrigerate for at least 4 hours, or until completely firm. Cut into squares and top with a dollop of whipped cream and a sprinkle of extra lime zest before serving. They are best served cold and make a wonderful, quick dessert for any gathering!",
    category: "quickBites",
    time: 20,
    difficulty: "easy",
    servings: 12,
    tags: ["no-bake", "citrus", "summer", "easy-dessert", "pie"],
    ingredients: [
      "1 1/2 cups graham cracker crumbs",
      "1/4 cup unsalted butter, melted",
      "1 (14 oz) can sweetened condensed milk",
      "1/2 cup fresh key lime juice",
      "1 tbsp lime zest",
      "Whipped cream for topping",
    ],
    prepTime: 20,
    cookTime: 0,
    images: ["https://example.com/images/key-lime-bars.jpg"],
  },

  // 9. Shakshuka (Poached Eggs in Tomato Sauce) (Lunch - Medium)
  {
    title: "Vibrant One-Pan Shakshuka with Feta",
    description:
      "A beautifully simple dish of eggs poached in a flavorful, vibrant tomato and pepper sauce. Excellent for breakfast, brunch, or a light lunch!",
    content:
      "Shakshuka is a fantastic, savory dish that is incredibly versatile. **The Sauce:** Heat olive oil in a large oven-safe skillet over medium heat. Sauté the chopped onion and bell pepper until soft, about 5-7 minutes. Stir in the minced garlic, cumin, and paprika, cooking for 1 minute until fragrant. Pour in the crushed tomatoes and the water. Season generously with salt and pepper. Bring the sauce to a gentle simmer and let it cook for about 10 minutes to reduce and concentrate the flavor. **The Eggs:** Using a spoon, create 4 small wells in the sauce. Gently crack an egg into each well. Cover the skillet and let the eggs poach for 5-8 minutes, or until the whites are set and the yolks are still runny (or to your desired doneness). **Garnish:** Remove from heat. Crumble the feta cheese and sprinkle the chopped fresh cilantro over the top. Serve directly from the skillet with crusty bread for dipping into the delicious sauce!",
    category: "lunch",
    time: 30,
    difficulty: "medium",
    servings: 4,
    tags: ["brunch", "mediterranean", "vegetarian", "one-pan", "eggs"],
    ingredients: [
      "2 tbsp olive oil",
      "1 small onion, chopped",
      "1 red bell pepper, chopped",
      "3 cloves garlic, minced",
      "1 tsp ground cumin",
      "1 tsp paprika",
      "1 (28 oz) can crushed tomatoes",
      "1/4 cup water",
      "4 large eggs",
      "1/4 cup crumbled feta cheese",
      "Fresh cilantro, chopped",
    ],
    prepTime: 10,
    cookTime: 20,
    images: ["https://example.com/images/shakshuka-skillet.jpg"],
  },

  // 10. Sous Vide Steak with Herb Butter (Entree - Hard)
  {
    title: "Perfect Sous Vide Ribeye with Garlic Herb Butter",
    description:
      "The only way to achieve edge-to-edge perfect medium-rare doneness. Finished with a high-heat sear for an incredible crust.",
    content:
      "This recipe utilizes the precision of the *sous vide* technique. **Sous Vide:** Preheat your water bath to 130°F (54.5°C) for a perfect medium-rare. Season the steaks generously with salt and pepper. Place the steaks in a vacuum seal bag or zipper-lock bag (use the water displacement method to remove air) along with a sprig of thyme. Cook for 2 to 3 hours. **Herb Butter:** While the steak cooks, combine the softened butter, minced garlic, and fresh rosemary in a small bowl. Set aside. **The Sear:** Remove the steaks from the bag and pat them *completely* dry with paper towels (this is critical for the crust!). Heat a cast-iron skillet over high heat with a high smoke-point oil until smoking hot. Sear the steaks for 60-90 seconds per side, until a deep brown crust forms. Immediately remove from the heat, top each steak with a generous pat of the herb butter, and let it rest for 5 minutes. The herb butter will melt down and infuse the steak with flavor. Slice and serve!",
    category: "entree",
    time: 185,
    difficulty: "hard",
    servings: 2,
    tags: ["steak", "sous-vide", "gourmet", "beef", "main-course"],
    ingredients: [
      "2 (1 inch thick) ribeye steaks",
      "Salt and black pepper",
      "1 sprig fresh thyme",
      "2 tbsp high smoke-point oil (e.g., grapeseed) for searing",
      "4 tbsp unsalted butter, softened",
      "2 cloves garlic, minced",
      "1 tsp fresh rosemary, chopped",
    ],
    prepTime: 10,
    cookTime: 175,
    images: ["https://example.com/images/sous-vide-ribeye.jpg"],
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
