const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const clients = await Client.find().sort({ createdAt: -1 });
  res.json(clients);
});

// Public contact endpoint as fallback: POST /api/clients/contact -> create lead-like entry
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    // Store as client note (minimal stub) or simply return success
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(400).json({ success: false });
  }
});

module.exports = router;


