const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    unique: true,
    sparse: true,
    required: function() {
      return this.role === 'user';
    },
    index: true,  // Add index for faster queries
  },
  username: { type: String },
  password: {
    type: String,
    required: function () {
      return this.role === 'admin';
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
    default: 'user',
  },
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  email: { type: String, required: true, unique: true, index: true },
  phone: {
    primary: { type: String, default: '' },
    secondary: { type: String, default: '' }
  },
  avatar: { type: String, default: '' },
  demographics: {
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      default: 'prefer-not-to-say'
    }
  },
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    isDefault: { type: Boolean, default: false },
    fullName: String,
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    landmark: String,
    phone: String
  }],
  mfaEnabled: {
    type: Boolean,
    default: false,
  },
  mfaSecret: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function (next) {
  this.lastUpdated = Date.now();
  if (this.role === 'admin' && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  if (this.role !== 'admin') return false;
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
