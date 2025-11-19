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

module.exports = {
  descriptionRecommendation,
  tagRecommendation,
};
