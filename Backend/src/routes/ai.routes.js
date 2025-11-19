const express = require("express");
const router = express.Router();

const {
  tagRecommendation,
  descriptionRecommendation,
  chatBot,
} = require("../controllers/ai.controller");

router.post("/generate-desc", descriptionRecommendation);
router.post("/generate-tags", tagRecommendation);
router.post("/chatBot", chatBot);

module.exports = router;
