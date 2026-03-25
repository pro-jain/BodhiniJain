const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const auth = require("../middleware/auth");

// CREATE (protected)
router.post("/", auth, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    return res.status(201).json(project);
  } catch (err) {
    console.error("Create project error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// READ (public)
router.get("/", async (_req, res) => {
  try {
    const projects = await Project.find();
    return res.json(projects);
  } catch (err) {
    console.error("List projects error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// UPDATE (protected)
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json(updated);
  } catch (err) {
    console.error("Update project error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete project error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;