const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Company Information
  company: {
    name: {
      type: String,
      default: 'CodeAxis'
    },
    email: {
      type: String,
      default: 'info@codeaxis.com'
    },
    phone: {
      type: String,
      default: '+94 11 123 4567'
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
      default: 'https://codeaxis.com'
    },
    logo: {
      public_id: String,
      url: String
    },
    favicon: {
      public_id: String,
      url: String
    },
    description: String,
    mission: String,
    vision: String
  },
  // Project Configuration
  project: {
    statuses: [{
      name: {
        type: String,
        required: true
      },
      color: {
        type: String,
        default: '#6c757d'
      },
      order: {
        type: Number,
        default: 0
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    priorities: [{
      name: {
        type: String,
        required: true
      },
      color: {
        type: String,
        default: '#6c757d'
      },
      order: {
        type: Number,
        default: 0
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    categories: [{
      name: {
        type: String,
        required: true
      },
      description: String,
      icon: String,
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    defaultCurrency: {
      type: String,
      default: 'LKR'
    },
    supportedCurrencies: [{
      code: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      symbol: String,
      isActive: {
        type: Boolean,
        default: true
      }
    }]
  },
  // Payment Configuration
  payment: {
    methods: [{
      name: {
        type: String,
        required: true
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    types: [{
      name: {
        type: String,
        required: true
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    invoicePrefix: {
      type: String,
      default: 'INV'
    },
    receiptPrefix: {
      type: String,
      default: 'RCP'
    }
  },
  // Email Configuration
  email: {
    templates: {
      welcome: {
        subject: String,
        body: String
      },
      passwordReset: {
        subject: String,
        body: String
      },
      newLead: {
        subject: String,
        body: String
      },
      paymentConfirmation: {
        subject: String,
        body: String
      },
      projectUpdate: {
        subject: String,
        body: String
      }
    },
    signature: String,
    footer: String
  },
  // System Configuration
  system: {
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    maintenanceMessage: String,
    maxFileSize: {
      type: Number,
      default: 10485760 // 10MB
    },
    allowedFileTypes: [String],
    sessionTimeout: {
      type: Number,
      default: 3600 // 1 hour in seconds
    },
    maxLoginAttempts: {
      type: Number,
      default: 5
    },
    lockoutDuration: {
      type: Number,
      default: 7200 // 2 hours in seconds
    },
    enableAuditLog: {
      type: Boolean,
      default: true
    },
    enableNotifications: {
      type: Boolean,
      default: true
    }
  },
  // SEO Configuration
  seo: {
    defaultMetaTitle: String,
    defaultMetaDescription: String,
    defaultMetaKeywords: String,
    googleAnalyticsId: String,
    googleTagManagerId: String,
    facebookPixelId: String,
    twitterCardType: {
      type: String,
      default: 'summary_large_image'
    }
  },
  // Social Media
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    youtube: String,
    github: String
  },
  // Contact Information
  contact: {
    supportEmail: String,
    salesEmail: String,
    emergencyPhone: String,
    officeHours: String,
    timezone: {
      type: String,
      default: 'Asia/Colombo'
    }
  },
  // Backup Configuration
  backup: {
    autoBackup: {
      type: Boolean,
      default: true
    },
    backupFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    backupRetention: {
      type: Number,
      default: 30 // days
    },
    lastBackup: Date,
    backupLocation: String
  },
  // Version and Updates
  version: {
    current: {
      type: String,
      default: '1.0.0'
    },
    latest: String,
    updateAvailable: {
      type: Boolean,
      default: false
    },
    lastChecked: Date
  },
  // Created and updated by
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Virtual for full company address
settingsSchema.virtual('company.fullAddress').get(function() {
  const address = this.company.address;
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

// Virtual for active project statuses
settingsSchema.virtual('project.activeStatuses').get(function() {
  return this.project.statuses.filter(status => status.isActive);
});

// Virtual for active project priorities
settingsSchema.virtual('project.activePriorities').get(function() {
  return this.project.priorities.filter(priority => priority.isActive);
});

// Virtual for active project categories
settingsSchema.virtual('project.activeCategories').get(function() {
  return this.project.categories.filter(category => category.isActive);
});

// Virtual for active currencies
settingsSchema.virtual('project.activeCurrencies').get(function() {
  return this.project.supportedCurrencies.filter(currency => currency.isActive);
});

// Indexes
settingsSchema.index({ 'company.name': 1 });
settingsSchema.index({ 'system.maintenanceMode': 1 });
settingsSchema.index({ 'version.current': 1 });

// Pre-save middleware
settingsSchema.pre('save', function(next) {
  // Ensure only one settings document exists
  if (this.isNew) {
    this.constructor.countDocuments({}, (err, count) => {
      if (err) return next(err);
      if (count > 0) {
        return next(new Error('Only one settings document can exist'));
      }
      next();
    });
  } else {
    next();
  }
});

// Method to get setting value by path
settingsSchema.methods.getSetting = function(path) {
  return path.split('.').reduce((obj, key) => obj && obj[key], this);
};

// Method to set setting value by path
settingsSchema.methods.setSetting = function(path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((obj, key) => {
    if (!obj[key]) obj[key] = {};
    return obj[key];
  }, this);
  target[lastKey] = value;
  return this.save();
};

// Method to update company information
settingsSchema.methods.updateCompanyInfo = function(companyData, adminId) {
  Object.assign(this.company, companyData);
  this.updatedBy = adminId;
  return this.save();
};

// Method to add project status
settingsSchema.methods.addProjectStatus = function(statusData, adminId) {
  const newStatus = {
    ...statusData,
    order: this.project.statuses.length
  };
  this.project.statuses.push(newStatus);
  this.updatedBy = adminId;
  return this.save();
};

// Method to update project status
settingsSchema.methods.updateProjectStatus = function(statusId, updateData, adminId) {
  const status = this.project.statuses.id(statusId);
  if (status) {
    Object.assign(status, updateData);
    this.updatedBy = adminId;
    return this.save();
  }
  throw new Error('Project status not found');
};

// Method to delete project status
settingsSchema.methods.deleteProjectStatus = function(statusId, adminId) {
  const status = this.project.statuses.id(statusId);
  if (status) {
    status.remove();
    this.updatedBy = adminId;
    return this.save();
  }
  throw new Error('Project status not found');
};

// Method to reorder project statuses
settingsSchema.methods.reorderProjectStatuses = function(statusIds, adminId) {
  statusIds.forEach((statusId, index) => {
    const status = this.project.statuses.id(statusId);
    if (status) {
      status.order = index;
    }
  });
  this.updatedBy = adminId;
  return this.save();
};

// Method to get system status
settingsSchema.methods.getSystemStatus = function() {
  return {
    maintenanceMode: this.system.maintenanceMode,
    maintenanceMessage: this.system.maintenanceMessage,
    version: this.version.current,
    updateAvailable: this.version.updateAvailable,
    lastBackup: this.backup.lastBackup,
    sessionTimeout: this.system.sessionTimeout,
    maxFileSize: this.system.maxFileSize
  };
};

// Method to enable maintenance mode
settingsSchema.methods.enableMaintenanceMode = function(message, adminId) {
  this.system.maintenanceMode = true;
  this.system.maintenanceMessage = message;
  this.updatedBy = adminId;
  return this.save();
};

// Method to disable maintenance mode
settingsSchema.methods.disableMaintenanceMode = function(adminId) {
  this.system.maintenanceMode = false;
  this.system.maintenanceMessage = undefined;
  this.updatedBy = adminId;
  return this.save();
};

// Static method to get settings (creates default if none exists)
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  
  if (!settings) {
    // Create default settings
    settings = new this({
      createdBy: 'system', // Will be replaced with actual admin ID
      company: {
        name: 'CodeAxis',
        email: 'info@codeaxis.com',
        phone: '+94 11 123 4567',
        country: 'Sri Lanka',
        website: 'https://codeaxis.com'
      },
      project: {
        statuses: [
          { name: 'Planning', color: '#17a2b8', order: 0 },
          { name: 'In Progress', color: '#ffc107', order: 1 },
          { name: 'Review', color: '#fd7e14', order: 2 },
          { name: 'Testing', color: '#6f42c1', order: 3 },
          { name: 'Completed', color: '#28a745', order: 4 },
          { name: 'On Hold', color: '#6c757d', order: 5 },
          { name: 'Cancelled', color: '#dc3545', order: 6 }
        ],
        priorities: [
          { name: 'Low', color: '#6c757d', order: 0 },
          { name: 'Medium', color: '#17a2b8', order: 1 },
          { name: 'High', color: '#ffc107', order: 2 },
          { name: 'Urgent', color: '#dc3545', order: 3 }
        ],
        defaultCurrency: 'LKR',
        supportedCurrencies: [
          { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs.' },
          { code: 'USD', name: 'US Dollar', symbol: '$' },
          { code: 'EUR', name: 'Euro', symbol: '€' }
        ]
      },
      payment: {
        methods: [
          { name: 'Bank Transfer' },
          { name: 'Cash' },
          { name: 'Online Payment' },
          { name: 'Cheque' }
        ],
        types: [
          { name: 'Advance' },
          { name: 'Partial' },
          { name: 'Final' },
          { name: 'Milestone' }
        ]
      }
    });
    
    await settings.save();
  }
  
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
