const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register a new admin user (one-time helper). In production, protect this route.
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Store password as-is to match existing plain-text data in the collection
    const user = new User({ username, password });
    await user.save();

    return res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Register error", err);
    // Send more detail to help debug
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login to receive a JWT token
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (password !== user.password) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({ token, username: user.username });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
