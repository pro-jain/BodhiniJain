const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const experienceRoutes = require("./routes/experiences");
const achievementRoutes = require("./routes/achievements");
const interestRoutes = require("./routes/interests");
const skillsRoutes = require("./routes/skills");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow multiple origins (local dev + deployed frontend)
const allowedOrigins = [
  "http://localhost:5173",
  "https://airy-spirit.railway.app", // backend itself (for health)
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGIN_2,
  process.env.CORS_ORIGIN_3,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api/skills", skillsRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo connection error", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
