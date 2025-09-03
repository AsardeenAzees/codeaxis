const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const { generateToken, generateRefreshToken, verifyRefreshToken, generatePasswordResetToken } = require('../utils/generateToken');
const { sendEmail } = require('../utils/sendEmail');
const { protect } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (user.isAccountLocked && user.isAccountLocked()) {
      return res.status(423).json({ success: false, message: 'Account is locked' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      await user.incLoginAttempts();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await user.resetLoginAttempts();
    user.lastLogin = new Date();
    await user.save();

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    res.json({ success: true, accessToken, refreshToken, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email, nic } = req.body || {};
  if (!email || !nic) return res.status(400).json({ success: false, message: 'Email and NIC are required' });
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(200).json({ success: true, message: 'If the account exists, an email will be sent' });

    const nicMatches = user.nicHash ? await bcrypt.compare(nic.toUpperCase(), user.nicHash) : (user.nic && user.nic.toUpperCase() === nic.toUpperCase());
    if (!nicMatches) return res.status(200).json({ success: true, message: 'If the account exists, an email will be sent' });

    const { resetToken, hashedToken } = generatePasswordResetToken();
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    try { 
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `<p>You requested a password reset.</p><p>Use this link to reset: <a href="${resetUrl}">${resetUrl}</a></p>`
      });
    } catch (e) {
      console.error('Email send failed (dev):', e.message);
    }

    return res.json({ success: true, message: 'If the account exists, an email will be sent' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword) return res.status(400).json({ success: false, message: 'Invalid payload' });
  try {
    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1, refreshTokenExpires: 1 } });
  } catch {}
  res.json({ success: true });
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required' });
  try {
    const { valid, decoded } = verifyRefreshToken(refreshToken);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    const accessToken = generateToken(user._id);
    res.json({ success: true, accessToken });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

// GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  const updates = req.body || {};
  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Update failed' });
  }
});

module.exports = router;


