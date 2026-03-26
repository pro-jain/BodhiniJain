const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Skill", interestSchema,"skills");
