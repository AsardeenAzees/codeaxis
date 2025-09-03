const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot exceed 100 characters']
  },
  organization: {
    type: String,
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required'],
    trim: true,
    maxlength: [100, 'Contact person name cannot exceed 100 characters']
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
  address: {
    street: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'Sri Lanka'
    },
    postalCode: String
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Website must start with http:// or https://']
  },
  linkedin: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/.+/, 'Please enter a valid LinkedIn URL']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  // Payer details if different from client
  payerDetails: {
    name: String,
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    }
  },
  // Statistics
  totalProjects: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  // Client rating and feedback
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for full address
clientSchema.virtual('fullAddress').get(function() {
  const address = this.address;
  if (!address) return '';
  
  const parts = [
    address.street,
    address.city,
    address.state,
    address.country,
    address.postalCode
  ].filter(Boolean);
  
  return parts.join(', ');
});

// Virtual for average rating
clientSchema.virtual('averageRating').get(function() {
  if (this.totalRatings === 0) return 0;
  return (this.rating / this.totalRatings).toFixed(1);
});

// Indexes
clientSchema.index({ email: 1 });
clientSchema.index({ name: 1 });
clientSchema.index({ organization: 1 });
clientSchema.index({ tags: 1 });
clientSchema.index({ isActive: 1 });

// Pre-save middleware to update statistics
clientSchema.pre('save', function(next) {
  // Update totalProjects count if this is a new client
  if (this.isNew) {
    this.totalProjects = 0;
    this.totalRevenue = 0;
    this.rating = 0;
    this.totalRatings = 0;
  }
  next();
});

// Method to update project count
clientSchema.methods.updateProjectCount = function(increment = 1) {
  this.totalProjects = Math.max(0, this.totalProjects + increment);
  return this.save();
};

// Method to update revenue
clientSchema.methods.updateRevenue = function(amount, currency = 'LKR') {
  if (currency === this.currency) {
    this.totalRevenue += amount;
  }
  return this.save();
};

// Method to add rating
clientSchema.methods.addRating = function(newRating) {
  if (newRating >= 1 && newRating <= 5) {
    this.rating += newRating;
    this.totalRatings += 1;
    return this.save();
  }
  throw new Error('Rating must be between 1 and 5');
};

// Method to get client summary
clientSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    organization: this.organization,
    contactPerson: this.contactPerson,
    email: this.email,
    phone: this.phone,
    totalProjects: this.totalProjects,
    totalRevenue: this.totalRevenue,
    currency: this.currency,
    averageRating: this.averageRating,
    totalRatings: this.totalRatings,
    isActive: this.isActive,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Client', clientSchema);
