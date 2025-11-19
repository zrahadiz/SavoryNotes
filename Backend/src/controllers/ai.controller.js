const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

const { response } = require("../utils/formatResponse");

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const tagRecommendation = async (req, res) => {
  try {
    const { title, ingredients, content } = req.body;

    if (!title || !ingredients || !content) {
      return res.status(400).json({
        error: "title, ingredients, and content are required",
      });
    }

    const prompt = `
      Suggest exactly 5 relevant tags for this recipe.
      Return ONLY comma-separated lowercase tags (no numbering, no explanation).

      Title: ${title}
      Ingredients: ${ingredients.join(", ")}
      Content: ${content}

      Example output: vegan, spicy, dinner, asian, healthy
      `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text.trim();

    const tags = text.split(",").map((tag) => tag.trim().toLowerCase());

    return res.json({ tags });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  tagRecommendation,
};
