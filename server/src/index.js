require("dotenv").config();

const express = require("express");
const cors = require("cors");

const matchRoutes = require("./routes/match");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "FanPulse AI backend is running!",
  });
});

// Match routes
app.use("/api/match", matchRoutes);

// Handle unknown endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found.",
  });
});

app.listen(PORT, () => {
  console.log(`FanPulse AI server running at http://localhost:${PORT}`);
});