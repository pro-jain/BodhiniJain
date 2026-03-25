const express = require("express");
const router = express.Router();
const Interest = require("../models/Interest");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const doc = new Interest(req.body);
    await doc.save();
    return res.status(201).json(doc);
  } catch (err) {
    console.error("Create interest error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const docs = await Interest.find();
    return res.json(docs);
  } catch (err) {
    console.error("List interests error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Interest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json(updated);
  } catch (err) {
    console.error("Update interest error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Interest.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete interest error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
