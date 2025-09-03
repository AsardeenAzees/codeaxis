const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  type: {
    type: String,
    enum: ['advance', 'partial', 'final', 'milestone'],
    required: [true, 'Payment type is required']
  },
  method: {
    type: String,
    enum: ['bank', 'cash', 'online', 'cheque', 'other'],
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'confirmed', 'overdue', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  paidDate: Date,
  confirmedDate: Date,
  // Payment details
  reference: {
    type: String,
    trim: true,
    maxlength: [100, 'Reference cannot exceed 100 characters']
  },
  transactionId: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  // Invoice and receipt
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  receiptNumber: String,
  // Attachments
  attachments: [{
    public_id: String,
    url: String,
    name: String,
    type: String,
    size: Number
  }],
  // Payer details (if different from client)
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
  // Admin tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  confirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Financial calculations
  taxAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  // Status tracking
  isActive: {
    type: Boolean,
    default: true
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderDate: Date
}, {
  timestamps: true
});

// Virtual for payment status display
paymentSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'Pending',
    paid: 'Paid',
    confirmed: 'Confirmed',
    overdue: 'Overdue',
    cancelled: 'Cancelled'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for payment type display
paymentSchema.virtual('typeDisplay').get(function() {
  const typeMap = {
    advance: 'Advance',
    partial: 'Partial',
    final: 'Final',
    milestone: 'Milestone'
  };
  return typeMap[this.type] || this.type;
});

// Virtual for payment method display
paymentSchema.virtual('methodDisplay').get(function() {
  const methodMap = {
    bank: 'Bank Transfer',
    cash: 'Cash',
    online: 'Online Payment',
    cheque: 'Cheque',
    other: 'Other'
  };
  return methodMap[this.method] || this.method;
});

// Virtual for days overdue
paymentSchema.virtual('daysOverdue').get(function() {
  if (this.status === 'overdue' && this.dueDate) {
    const now = new Date();
    const diffTime = Math.abs(now - this.dueDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual for payment summary
paymentSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    amount: this.amount,
    currency: this.currency,
    status: this.status,
    type: this.type,
    dueDate: this.dueDate,
    paidDate: this.paidDate,
    invoiceNumber: this.invoiceNumber
  };
});

// Indexes
paymentSchema.index({ project: 1 });
paymentSchema.index({ client: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ type: 1 });
paymentSchema.index({ dueDate: 1 });
paymentSchema.index({ paidDate: 1 });
paymentSchema.index({ invoiceNumber: 1 });
paymentSchema.index({ createdBy: 1 });
paymentSchema.index({ isActive: 1 });

// Pre-save middleware to generate invoice number and calculate totals
paymentSchema.pre('save', function(next) {
  // Generate invoice number if not exists
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.invoiceNumber = `INV-${year}${month}-${random}`;
  }
  
  // Calculate total amount
  this.totalAmount = this.amount + this.taxAmount - this.discountAmount;
  
  // Set status based on dates
  if (this.status === 'pending' && this.dueDate < new Date()) {
    this.status = 'overdue';
  }
  
  next();
});

// Method to mark payment as paid
paymentSchema.methods.markAsPaid = function(transactionId = null, notes = null) {
  this.status = 'paid';
  this.paidDate = new Date();
  if (transactionId) this.transactionId = transactionId;
  if (notes) this.notes = notes;
  return this.save();
};

// Method to confirm payment
paymentSchema.methods.confirmPayment = function(adminId, notes = null) {
  this.status = 'confirmed';
  this.confirmedDate = new Date();
  this.confirmedBy = adminId;
  if (notes) this.notes = notes;
  return this.save();
};

// Method to cancel payment
paymentSchema.methods.cancelPayment = function(reason = null) {
  this.status = 'cancelled';
  if (reason) this.notes = reason;
  return this.save();
};

// Method to send reminder
paymentSchema.methods.sendReminder = function() {
  this.reminderSent = true;
  this.reminderDate = new Date();
  return this.save();
};

// Method to calculate overdue days
paymentSchema.methods.calculateOverdueDays = function() {
  if (this.status === 'pending' && this.dueDate < new Date()) {
    const now = new Date();
    const diffTime = Math.abs(now - this.dueDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
};

// Method to get payment details for invoice
paymentSchema.methods.getInvoiceData = function() {
  return {
    invoiceNumber: this.invoiceNumber,
    project: this.project,
    client: this.client,
    amount: this.amount,
    currency: this.currency,
    taxAmount: this.taxAmount,
    discountAmount: this.discountAmount,
    totalAmount: this.totalAmount,
    dueDate: this.dueDate,
    type: this.type,
    notes: this.notes,
    createdAt: this.createdAt
  };
};

// Static method to get overdue payments
paymentSchema.statics.getOverduePayments = function() {
  return this.find({
    status: 'pending',
    dueDate: { $lt: new Date() },
    isActive: true
  }).populate('project client');
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = function() {
  return this.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Payment', paymentSchema);
