const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check if user is locked
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is locked due to multiple failed login attempts'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

// Check if user is main admin
const isMainAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  if (req.user.role !== 'main_admin') {
    return res.status(403).json({
      success: false,
      message: 'Only main admin can access this route'
    });
  }

  next();
};

// Check if user can manage their own account
const canManageOwnAccount = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  const userId = req.params.id || req.body.userId;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }

  // Users can manage their own account, main admin can manage any account
  if (req.user._id.toString() !== userId && req.user.role !== 'main_admin') {
    return res.status(403).json({
      success: false,
      message: 'You can only manage your own account'
    });
  }

  next();
};

// Check if user can delete account
const canDeleteAccount = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  const userId = req.params.id || req.body.userId;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }

  // Users cannot delete their own account, main admin can delete any account
  if (req.user._id.toString() === userId) {
    return res.status(403).json({
      success: false,
      message: 'You cannot delete your own account'
    });
  }

  if (req.user.role !== 'main_admin') {
    return res.status(403).json({
      success: false,
      message: 'Only main admin can delete accounts'
    });
  }

  next();
};

// Check if user can access project
const canAccessProject = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  const projectId = req.params.id || req.body.projectId;
  
  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: 'Project ID is required'
    });
  }

  // Main admin can access all projects
  if (req.user.role === 'main_admin') {
    return next();
  }

  // Regular admins can access projects they're assigned to
  // This will be checked in the route handler by populating the project
  next();
};

// Check if user can access client
const canAccessClient = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  // All authenticated users can access clients
  next();
};

// Check if user can access payment
const canAccessPayment = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  // All authenticated users can access payments
  next();
};

// Check if user can access lead
const canAccessLead = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  // All authenticated users can access leads
  next();
};

// Check if user can access testimonial
const canAccessTestimonial = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  // All authenticated users can access testimonials
  next();
};

// Check if user can access settings
const canAccessSettings = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  // Only main admin can access settings
  if (req.user.role !== 'main_admin') {
    return res.status(403).json({
      success: false,
      message: 'Only main admin can access settings'
    });
  }

  next();
};

// Optional authentication - user can be authenticated but it's not required
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive && !user.isLocked()) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we don't fail the request
      console.log('Invalid token in optional auth:', error.message);
    }
  }

  next();
};

module.exports = {
  protect,
  authorize,
  isMainAdmin,
  canManageOwnAccount,
  canDeleteAccount,
  canAccessProject,
  canAccessClient,
  canAccessPayment,
  canAccessLead,
  canAccessTestimonial,
  canAccessSettings,
  optionalAuth
};
