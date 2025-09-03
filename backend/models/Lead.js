const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  organization: {
    type: String,
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  projectBrief: {
    type: String,
    required: [true, 'Project brief is required'],
    maxlength: [2000, 'Project brief cannot exceed 2000 characters']
  },
  budgetRange: {
    type: String,
    enum: ['under_50k', '50k_100k', '100k_250k', '250k_500k', '500k_1m', 'above_1m'],
    required: [true, 'Budget range is required']
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  projectType: {
    type: String,
    required: [true, 'Project type is required'],
    trim: true
  },
  techStack: [{
    type: String,
    trim: true
  }],
  timeline: {
    type: String,
    enum: ['1_3_months', '3_6_months', '6_12_months', 'above_1_year'],
    required: [true, 'Timeline is required']
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  // File attachments
  attachments: [{
    public_id: String,
    url: String,
    name: String,
    type: String,
    size: Number
  }],
  // Lead status
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  // Communication tracking
  notes: [{
    content: {
      type: String,
      required: true
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Follow-up tracking
  lastContactDate: Date,
  nextFollowUpDate: Date,
  followUpCount: {
    type: Number,
    default: 0
  },
  // Source tracking
  source: {
    type: String,
    enum: ['website', 'portfolio', 'referral', 'social_media', 'other'],
    default: 'website'
  },
  referrer: String,
  // Admin assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Conversion tracking
  convertedToProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  conversionDate: Date,
  // Marketing consent
  marketingConsent: {
    type: Boolean,
    default: false
  },
  // IP and location tracking
  ipAddress: String,
  userAgent: String,
  location: {
    country: String,
    city: String,
    region: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for budget range display
leadSchema.virtual('budgetRangeDisplay').get(function() {
  const budgetMap = {
    under_50k: 'Under LKR 50,000',
    '50k_100k': 'LKR 50,000 - 100,000',
    '100k_250k': 'LKR 100,000 - 250,000',
    '250k_500k': 'LKR 250,000 - 500,000',
    '500k_1m': 'LKR 500,000 - 1,000,000',
    above_1m: 'Above LKR 1,000,000'
  };
  return budgetMap[this.budgetRange] || this.budgetRange;
});

// Virtual for timeline display
leadSchema.virtual('timelineDisplay').get(function() {
  const timelineMap = {
    '1_3_months': '1-3 months',
    '3_6_months': '3-6 months',
    '6_12_months': '6-12 months',
    'above_1_year': 'Above 1 year'
  };
  return timelineMap[this.timeline] || this.timeline;
});

// Virtual for urgency display
leadSchema.virtual('urgencyDisplay').get(function() {
  const urgencyMap = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
  };
  return urgencyMap[this.urgency] || this.urgency;
});

// Virtual for status display
leadSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    proposal_sent: 'Proposal Sent',
    negotiation: 'Negotiation',
    won: 'Won',
    lost: 'Lost'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for priority display
leadSchema.virtual('priorityDisplay').get(function() {
  const priorityMap = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
  };
  return priorityMap[this.priority] || this.priority;
});

// Virtual for source display
leadSchema.virtual('sourceDisplay').get(function() {
  const sourceMap = {
    website: 'Website',
    portfolio: 'Portfolio',
    referral: 'Referral',
    social_media: 'Social Media',
    other: 'Other'
  };
  return sourceMap[this.source] || this.source;
});

// Indexes
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: 1 });
leadSchema.index({ nextFollowUpDate: 1 });
leadSchema.index({ isActive: 1 });

// Pre-save middleware
leadSchema.pre('save', function(next) {
  // Set default values for new leads
  if (this.isNew) {
    this.followUpCount = 0;
    this.status = 'new';
    this.priority = 'medium';
  }
  
  // Update follow-up count when notes are added
  if (this.isModified('notes') && this.notes.length > 0) {
    this.followUpCount = this.notes.length;
  }
  
  next();
});

// Method to add note
leadSchema.methods.addNote = function(content, adminId) {
  this.notes.push({
    content,
    admin: adminId
  });
  this.lastContactDate = new Date();
  this.followUpCount = this.notes.length;
  return this.save();
};

// Method to update status
leadSchema.methods.updateStatus = function(newStatus, adminId, note = null) {
  this.status = newStatus;
  this.lastContactDate = new Date();
  
  if (note) {
    this.notes.push({
      content: `Status changed to ${newStatus}: ${note}`,
      admin: adminId
    });
  }
  
  return this.save();
};

// Method to assign to admin
leadSchema.methods.assignToAdmin = function(adminId, note = null) {
  this.assignedTo = adminId;
  this.lastContactDate = new Date();
  
  if (note) {
    this.notes.push({
      content: `Assigned to admin: ${note}`,
      admin: adminId
    });
  }
  
  return this.save();
};

// Method to schedule follow-up
leadSchema.methods.scheduleFollowUp = function(followUpDate, note = null, adminId = null) {
  this.nextFollowUpDate = followUpDate;
  
  if (note) {
    this.notes.push({
      content: `Follow-up scheduled for ${followUpDate.toDateString()}: ${note}`,
      admin: adminId
    });
  }
  
  return this.save();
};

// Method to convert to project
leadSchema.methods.convertToProject = function(projectId, adminId, note = null) {
  this.convertedToProject = projectId;
  this.conversionDate = new Date();
  this.status = 'won';
  
  if (note) {
    this.notes.push({
      content: `Converted to project: ${note}`,
      admin: adminId
    });
  }
  
  return this.save();
};

// Method to get lead summary
leadSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    organization: this.organization,
    projectType: this.projectType,
    budgetRange: this.budgetRangeDisplay,
    timeline: this.timelineDisplay,
    status: this.statusDisplay,
    priority: this.priorityDisplay,
    assignedTo: this.assignedTo,
    createdAt: this.createdAt,
    lastContactDate: this.lastContactDate,
    nextFollowUpDate: this.nextFollowUpDate
  };
};

// Static method to get leads by status
leadSchema.statics.getLeadsByStatus = function(status) {
  return this.find({ status, isActive: true })
    .populate('assignedTo', 'firstName lastName email')
    .sort({ createdAt: -1 });
};

// Static method to get overdue follow-ups
leadSchema.statics.getOverdueFollowUps = function() {
  return this.find({
    nextFollowUpDate: { $lt: new Date() },
    status: { $nin: ['won', 'lost'] },
    isActive: true
  }).populate('assignedTo', 'firstName lastName email');
};

// Static method to get lead statistics
leadSchema.statics.getLeadStats = function() {
  return this.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Lead', leadSchema);
