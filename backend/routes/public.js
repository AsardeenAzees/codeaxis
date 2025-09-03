const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Settings = require('../models/Settings');
const Lead = require('../models/Lead');

// GET /api/public/projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find({ 'visibility.public': true }).sort({ completedDate: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/public/projects/:slug
router.get('/projects/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, 'visibility.public': true });
    if (!project) return res.status(404).json({ success: false, message: 'Not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/public/settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

// POST /api/public/contact (contact form)
router.post('/contact', async (req, res) => {
  try {
    await Lead.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message,
      source: 'contact_form',
      status: 'new'
    });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false });
  }
});


