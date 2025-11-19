const express = require("express");
const router = express.Router();

const {
  tagRecommendation,
  descriptionRecommendation,
} = require("../controllers/ai.controller");

router.post("/generate-desc", descriptionRecommendation);
router.post("/generate-tags", tagRecommendation);

module.exports = router;
