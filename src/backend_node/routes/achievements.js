const express = require("express");
const router = express.Router();
const Achievement = require("../models/Achievement");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const doc = new Achievement(req.body);
    await doc.save();
    return res.status(201).json(doc);
  } catch (err) {
    console.error("Create achievement error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const docs = await Achievement.find();
    return res.json(docs);
  } catch (err) {
    console.error("List achievements error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json(updated);
  } catch (err) {
    console.error("Update achievement error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete achievement error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
