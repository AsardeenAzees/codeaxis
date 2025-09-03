const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Project title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [5000, 'Project description cannot exceed 5000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client is required']
  },
  status: {
    type: String,
    required: [true, 'Project status is required'],
    enum: ['planning', 'in_progress', 'review', 'testing', 'completed', 'on_hold', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  },
  // Budget and financial details
  budget: {
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0, 'Budget cannot be negative']
    },
    currency: {
      type: String,
      default: 'LKR'
    },
    type: {
      type: String,
      enum: ['fixed', 'hourly', 'milestone'],
      default: 'fixed'
    }
  },
  // Project timeline
  plannedStartDate: {
    type: Date,
    required: [true, 'Planned start date is required']
  },
  plannedEndDate: {
    type: Date,
    required: [true, 'Planned end date is required']
  },
  actualStartDate: Date,
  actualEndDate: Date,
  // Project details
  category: {
    type: String,
    required: [true, 'Project category is required'],
    trim: true
  },
  techStack: [{
    type: String,
    trim: true
  }],
  features: [{
    type: String,
    trim: true
  }],
  // Media and attachments
  coverImage: {
    public_id: String,
    url: String
  },
  images: [{
    public_id: String,
    url: String,
    caption: String
  }],
  attachments: [{
    public_id: String,
    url: String,
    name: String,
    type: String,
    size: Number
  }],
  // Project outcomes and deliverables
  deliverables: [{
    type: String,
    trim: true
  }],
  outcomes: {
    type: String,
    maxlength: [1000, 'Project outcomes cannot exceed 1000 characters']
  },
  // Team and collaboration
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Progress tracking
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  milestones: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedDate: Date
  }],
  // Communication and notes
  notes: [{
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // SEO and public display
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  metaTitle: String,
  metaDescription: String,
  tags: [{
    type: String,
    trim: true
  }],
  // Statistics
  totalPayments: {
    type: Number,
    default: 0
  },
  pendingAmount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for project duration
projectSchema.virtual('plannedDuration').get(function() {
  if (!this.plannedStartDate || !this.plannedEndDate) return null;
  const diffTime = Math.abs(this.plannedEndDate - this.plannedStartDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

projectSchema.virtual('actualDuration').get(function() {
  if (!this.actualStartDate || !this.actualEndDate) return null;
  const diffTime = Math.abs(this.actualEndDate - this.actualStartDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for project status display
projectSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    planning: 'Planning',
    in_progress: 'In Progress',
    review: 'Review',
    testing: 'Testing',
    completed: 'Completed',
    on_hold: 'On Hold',
    cancelled: 'Cancelled'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for priority display
projectSchema.virtual('priorityDisplay').get(function() {
  const priorityMap = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
  };
  return priorityMap[this.priority] || this.priority;
});

// Indexes
projectSchema.index({ title: 1 });
projectSchema.index({ client: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ visibility: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ techStack: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ plannedStartDate: 1 });
projectSchema.index({ plannedEndDate: 1 });
projectSchema.index({ slug: 1 });
projectSchema.index({ isActive: 1 });

// Pre-save middleware to generate slug
projectSchema.pre('save', function(next) {
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
    this.totalPayments = 0;
    this.pendingAmount = this.budget.amount;
  }
  
  next();
});

// Method to update progress
projectSchema.methods.updateProgress = function(progress) {
  if (progress >= 0 && progress <= 100) {
    this.progress = progress;
    return this.save();
  }
  throw new Error('Progress must be between 0 and 100');
};

// Method to add milestone
projectSchema.methods.addMilestone = function(milestone) {
  this.milestones.push(milestone);
  return this.save();
};

// Method to complete milestone
projectSchema.methods.completeMilestone = function(milestoneId) {
  const milestone = this.milestones.id(milestoneId);
  if (milestone) {
    milestone.completed = true;
    milestone.completedDate = new Date();
    return this.save();
  }
  throw new Error('Milestone not found');
};

// Method to add note
projectSchema.methods.addNote = function(content, authorId) {
  this.notes.push({
    content,
    author: authorId
  });
  return this.save();
};

// Method to update payment amounts
projectSchema.methods.updatePaymentAmounts = function(totalPaid) {
  this.totalPayments = totalPaid;
  this.pendingAmount = Math.max(0, this.budget.amount - totalPaid);
  return this.save();
};

// Method to check if project is public
projectSchema.methods.isPublic = function() {
  return this.visibility === 'public' && this.status === 'completed';
};

// Method to get public project data
projectSchema.methods.getPublicData = function() {
  if (!this.isPublic()) {
    throw new Error('Project is not public');
  }
  
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    shortDescription: this.shortDescription,
    category: this.category,
    techStack: this.techStack,
    features: this.features,
    coverImage: this.coverImage,
    images: this.images,
    outcomes: this.outcomes,
    deliverables: this.deliverables,
    plannedStartDate: this.plannedStartDate,
    actualEndDate: this.actualEndDate,
    slug: this.slug,
    tags: this.tags,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Project', projectSchema);
