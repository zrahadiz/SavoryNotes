const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

const { response } = require("../utils/formatResponse");

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const descriptionRecommendation = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      response(400, false, null, "title are required", res);
    }

    const prompt = `
      Create a short, appetizing description (max 250 characters) for this recipe: ${title}
      `;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const description = aiResponse.text;

    return response(
      200,
      true,
      description,
      "Successfuly generate description",
      res
    );
  } catch (error) {
    response(500, false, null, error.message, res);
  }
};

const tagRecommendation = async (req, res) => {
  try {
    const { title, ingredients, content } = req.body;

    if (!title || !ingredients || !content) {
      response(
        400,
        false,
        null,
        "title, ingredients, and content are required",
        res
      );
    }

    const prompt = `
      Suggest exactly 5 relevant tags for this recipe.
      Return ONLY comma-separated lowercase tags (no numbering, no explanation).

      Title: ${title}
      Ingredients: ${ingredients.join(", ")}
      Content: ${content}

      Example output: vegan, spicy, dinner, asian, healthy
      `;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = aiResponse.text.trim();

    const tags = text.split(",").map((tag) => tag.trim().toLowerCase());

    return response(200, true, tags, "Successfuly generate tags", res);
  } catch (error) {
    response(500, false, null, error.message, res);
  }
};

const chatBot = async (req, res) => {
  try {
    const { messages, recipe } = req.body;
    if (!messages || !Array.isArray(messages)) {
      response(400, false, null, "Messages array is required", res);
    }

    if (!recipe || !recipe.title) {
      response(400, false, null, "Recipe context is required", res);
    }

    const recipeContext = `You are a helpful cooking assistant helping a user with this recipe:
      **Recipe Title:** ${recipe.title}
      **Category:** ${recipe.category}
      **Difficulty:** ${recipe.difficulty}
      **Servings:** ${recipe.servings}
      **Total Time:** ${recipe.time} minutes
      ${recipe.prepTime ? `**Prep Time:** ${recipe.prepTime} minutes` : ""}
      ${recipe.cookTime ? `**Cook Time:** ${recipe.cookTime} minutes` : ""}

      **Ingredients:**
      ${
        recipe.ingredients
          ? recipe.ingredients.map((ing, i) => `${i + 1}. ${ing}`).join("\n")
          : "No ingredients listed"
      }

      **Instructions:**
      ${recipe.content || "No instructions provided"}

      ${
        recipe.tags && recipe.tags.length > 0
          ? `**Tags:** ${recipe.tags.join(", ")}`
          : ""
      }

      ---

      Your role:
      - Answer questions about this recipe
      - Suggest ingredient substitutions
      - Explain cooking techniques
      - Help with timing and temperature
      - Provide tips for better results
      - Suggest modifications (e.g., making it vegan, gluten-free)
      - Be friendly, encouraging, and concise

      Keep responses brief (2-3 paragraphs max) unless the user asks for detailed explanations.
      `;

    const chatText = [
      `SYSTEM: ${recipeContext}`,
      ...messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`),
    ].join("\n\n");

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatText,
    });

    const aiMessage = aiResponse.text;

    return response(
      200,
      true,
      {
        role: "assistant",
        content: aiMessage,
      },
      "Successfully get AI response",
      res
    );
  } catch (error) {
    console.error("AI Chat Error:", error);
    response(
      500,
      false,
      null,
      error.message || "Failed to get AI response",
      res
    );
  }
};

module.exports = {
  descriptionRecommendation,
  tagRecommendation,
  chatBot,
};
