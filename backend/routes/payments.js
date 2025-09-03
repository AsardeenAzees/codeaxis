const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const payments = await Payment.find().sort({ createdAt: -1 }).limit(100);
  res.json(payments);
});

module.exports = router;


