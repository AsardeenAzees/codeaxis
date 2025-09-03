const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, isMainAdmin } = require('../middleware/auth');

router.get('/', protect, isMainAdmin, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select('-password');
  res.json(users);
});

module.exports = router;


