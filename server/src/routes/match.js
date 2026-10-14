const express = require("express");
const router = express.Router();

const { match, getMatchContext } = require("../data/match");
const { simulateOver } = require("../services/scenarioEngine");
const {
  generateMatchInsights,
} = require("../services/aiInsights");

// GET /api/match
// Return the current match and calculated statistics
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: getMatchContext(),
  });
});

// POST /api/match/simulate
// Simulate a hypothetical over
router.post("/simulate", (req, res) => {
  try {
    const { runsScored, wicketsLost = 0 } = req.body;

    if (
      !Number.isInteger(runsScored) ||
      runsScored < 0 ||
      runsScored > 36
    ) {
      return res.status(400).json({
        success: false,
        error: "Runs scored must be an integer between 0 and 36.",
      });
    }

    if (
      !Number.isInteger(wicketsLost) ||
      wicketsLost < 0 ||
      wicketsLost > 10
    ) {
      return res.status(400).json({
        success: false,
        error: "Wickets lost must be an integer between 0 and 10.",
      });
    }

    const result = simulateOver(match, runsScored, wicketsLost);

    res.json({
      success: true,
      data: {
        scenario: {
          runsScored,
          wicketsLost,
        },
        result,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/insights", async (req, res) => {
  try {
    const matchContext = getMatchContext();

    const result = await generateMatchInsights(matchContext);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("AI insights error:", error.message);

    res.status(500).json({
      success: false,
      error: "Unable to generate AI match insights.",
    });
  }
});

module.exports = router;