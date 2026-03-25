const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  techStack: { type: [String], default: [] },
  link: { type: String, default: "" },
});

module.exports = mongoose.model("Project", projectSchema);