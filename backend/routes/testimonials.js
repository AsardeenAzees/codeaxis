const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

router.get('/', async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 }).limit(100);
  res.json(testimonials);
});

module.exports = router;


