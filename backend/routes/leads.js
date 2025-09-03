const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// Public endpoint to create a lead (Hire Us form)
router.post('/', async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid data' });
  }
});

module.exports = router;


