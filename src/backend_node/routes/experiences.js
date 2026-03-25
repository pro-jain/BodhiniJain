const express = require("express");
const router = express.Router();
const Experience = require("../models/Experience");
const auth = require("../middleware/auth");

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    const doc = new Experience(req.body);
    await doc.save();
    return res.status(201).json(doc);
  } catch (err) {
    console.error("Create experience error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// READ
router.get("/", async (_req, res) => {
  try {
    const docs = await Experience.find();
    return res.json(docs);
  } catch (err) {
    console.error("List experiences error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json(updated);
  } catch (err) {
    console.error("Update experience error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete experience error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
