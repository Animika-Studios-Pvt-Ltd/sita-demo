const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Razorpay fields (for old data compatibility)
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  
  // Cashfree fields (for new payments)
  cashfreeOrderId: {
    type: String
  },
  cashfreePaymentId: {
    type: String
  },
  paymentSessionId: {
    type: String
  },
  
  // Common fields
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['created', 'pending', 'paid', 'failed'],
    default: 'created'
  },
  userId: {
    type: String,
    required: true
  },
  notes: {
    type: Object
  },
  receipt: {
    type: String
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'cashfree'],
    default: 'cashfree'
  },
  
  // Timestamps
  paidAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create unique indexes (sparse allows nulls)
paymentSchema.index({ razorpayOrderId: 1 }, { unique: true, sparse: true });
paymentSchema.index({ cashfreeOrderId: 1 }, { unique: true, sparse: true });

// Update timestamp before saving
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
