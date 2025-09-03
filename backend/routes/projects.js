const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 }).limit(100);
  res.json(projects);
});

module.exports = router;


