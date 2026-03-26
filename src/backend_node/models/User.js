const mongoose = require("mongoose");

// Explicitly bind to the "portfolio" collection to match existing Atlas data
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // stored as plain text per existing data
  },
  { collection: "portfolio" }
);

module.exports = mongoose.model("User", userSchema);
