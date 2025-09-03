const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, isMainAdmin } = require('../middleware/auth');

// GET /api/settings
router.get('/', protect, async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings || {});
});

// PUT /api/settings
router.put('/', protect, isMainAdmin, async (req, res) => {
  const updates = req.body || {};
  const settings = await Settings.findOneAndUpdate({}, updates, { new: true, upsert: true });
  res.json(settings);
});

module.exports = router;


