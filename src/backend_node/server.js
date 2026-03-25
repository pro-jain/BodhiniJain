const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const experienceRoutes = require("./routes/experiences");
const achievementRoutes = require("./routes/achievements");
const interestRoutes = require("./routes/interests");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/interests", interestRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo connection error", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));