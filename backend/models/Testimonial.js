const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project is required']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client is required']
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot exceed 100 characters']
  },
  clientPosition: {
    type: String,
    trim: true,
    maxlength: [100, 'Client position cannot exceed 100 characters']
  },
  clientOrganization: {
    type: String,
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Testimonial title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Testimonial content is required'],
    maxlength: [1000, 'Content cannot exceed 1000 characters']
  },
  // Media
  clientImage: {
    public_id: String,
    url: String
  },
  // Approval and visibility
  isApproved: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  // Admin tracking
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Categories and tags
  categories: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  // SEO
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  metaTitle: String,
  metaDescription: String,
  // Statistics
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  // Moderation
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagReason: String,
  flaggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  flaggedAt: Date,
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for rating display
testimonialSchema.virtual('ratingDisplay').get(function() {
  return `${this.rating}/5`;
});

// Virtual for rating stars
testimonialSchema.virtual('ratingStars').get(function() {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= this.rating) {
      stars.push('★');
    } else {
      stars.push('☆');
    }
  }
  return stars.join('');
});

// Virtual for full client info
testimonialSchema.virtual('fullClientInfo').get(function() {
  const parts = [
    this.clientName,
    this.clientPosition,
    this.clientOrganization
  ].filter(Boolean);
  return parts.join(' at ');
});

// Indexes
testimonialSchema.index({ project: 1 });
testimonialSchema.index({ client: 1 });
testimonialSchema.index({ rating: 1 });
testimonialSchema.index({ isApproved: 1 });
testimonialSchema.index({ isPublic: 1 });
testimonialSchema.index({ categories: 1 });
testimonialSchema.index({ tags: 1 });
// Unique index for slug (single source of truth)
testimonialSchema.index({ slug: 1 }, { unique: true });
testimonialSchema.index({ isActive: 1 });
testimonialSchema.index({ createdAt: 1 });

// Pre-save middleware to generate slug
testimonialSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Set default values
  if (this.isNew) {
    this.helpfulCount = 0;
    this.reportCount = 0;
    this.isFlagged = false;
  }
  
  next();
});

// Method to approve testimonial
testimonialSchema.methods.approve = function(adminId) {
  this.isApproved = true;
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  return this.save();
};

// Method to reject testimonial
testimonialSchema.methods.reject = function(adminId, reason = null) {
  this.isApproved = false;
  this.isPublic = false;
  if (reason) this.flagReason = reason;
  return this.save();
};

// Method to flag testimonial
testimonialSchema.methods.flag = function(adminId, reason) {
  this.isFlagged = true;
  this.flagReason = reason;
  this.flaggedBy = adminId;
  this.flaggedAt = new Date();
  this.isPublic = false;
  return this.save();
};

// Method to unflag testimonial
testimonialSchema.methods.unflag = function(adminId) {
  this.isFlagged = false;
  this.flagReason = undefined;
  this.flaggedBy = undefined;
  this.flaggedAt = undefined;
  this.isPublic = true;
  return this.save();
};

// Method to mark as helpful
testimonialSchema.methods.markHelpful = function() {
  this.helpfulCount += 1;
  return this.save();
};

// Method to report testimonial
testimonialSchema.methods.report = function() {
  this.reportCount += 1;
  if (this.reportCount >= 3) {
    this.isPublic = false;
  }
  return this.save();
};

// Method to get public testimonial data
testimonialSchema.methods.getPublicData = function() {
  if (!this.isApproved || !this.isPublic || this.isFlagged) {
    throw new Error('Testimonial is not public');
  }
  
  return {
    id: this._id,
    clientName: this.clientName,
    clientPosition: this.clientPosition,
    clientOrganization: this.clientOrganization,
    rating: this.rating,
    title: this.title,
    content: this.content,
    clientImage: this.clientImage,
    categories: this.categories,
    tags: this.tags,
    helpfulCount: this.helpfulCount,
    createdAt: this.createdAt
  };
};

// Method to get testimonial summary
testimonialSchema.methods.getSummary = function() {
  return {
    id: this._id,
    clientName: this.clientName,
    clientOrganization: this.clientOrganization,
    rating: this.rating,
    title: this.title,
    isApproved: this.isApproved,
    isPublic: this.isPublic,
    isFlagged: this.isFlagged,
    helpfulCount: this.helpfulCount,
    createdAt: this.createdAt
  };
};

// Static method to get approved testimonials
testimonialSchema.statics.getApprovedTestimonials = function() {
  return this.find({
    isApproved: true,
    isPublic: true,
    isFlagged: false,
    isActive: true
  }).populate('project', 'title slug coverImage')
    .sort({ createdAt: -1 });
};

// Static method to get testimonials by rating
testimonialSchema.statics.getTestimonialsByRating = function(rating) {
  return this.find({
    rating,
    isApproved: true,
    isPublic: true,
    isFlagged: false,
    isActive: true
  }).populate('project', 'title slug coverImage')
    .sort({ createdAt: -1 });
};

// Static method to get testimonials by category
testimonialSchema.statics.getTestimonialsByCategory = function(category) {
  return this.find({
    categories: category,
    isApproved: true,
    isPublic: true,
    isFlagged: false,
    isActive: true
  }).populate('project', 'title slug coverImage')
    .sort({ createdAt: -1 });
};

// Static method to get pending testimonials
testimonialSchema.statics.getPendingTestimonials = function() {
  return this.find({
    isApproved: false,
    isActive: true
  }).populate('project', 'title')
    .populate('client', 'name organization')
    .sort({ createdAt: -1 });
};

// Static method to get flagged testimonials
testimonialSchema.statics.getFlaggedTestimonials = function() {
  return this.find({
    isFlagged: true,
    isActive: true
  }).populate('project', 'title')
    .populate('client', 'name organization')
    .sort({ flaggedAt: -1 });
};

// Static method to get testimonial statistics
testimonialSchema.statics.getTestimonialStats = function() {
  return this.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

// Static method to get average rating
testimonialSchema.statics.getAverageRating = function() {
  return this.aggregate([
    {
      $match: { 
        isApproved: true, 
        isPublic: true, 
        isFlagged: false, 
        isActive: true 
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalTestimonials: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Testimonial', testimonialSchema);
