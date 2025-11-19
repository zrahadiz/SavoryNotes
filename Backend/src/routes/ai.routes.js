const express = require("express");
const router = express.Router();

const { tagRecommendation } = require("../controllers/ai.controller");

router.post("/generate-tags", tagRecommendation);

module.exports = router;
