const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['parent', 'driver', 'admin'],
    default: 'parent'
  },
  // Parent specific fields
  childName: {
    type: String
  },
  childClass: {
    type: String
  },
  childDateOfBirth: {
    type: Date
  },
  selectedRoute: {
    type: String,
    enum: [
      'Puttalam Town to Kurunegala',
      'Kandy Town to Kurunegala',
      'Matale Town to Kurunegala',
      'Ibbagamuwa Town to Kurunegala',
      'Polgahawela to Kurunegala'
    ]
  },
  children: [{
    childName: String,
    childClass: String,
    childDateOfBirth: Date,
    selectedRoute: String
  }],
  // Driver specific fields
  dateOfBirth: {
    type: Date
  },
  phoneNumber: {
    type: String
  },
  nicNumber: {
    type: String
  },
  driverLicenseImage: {
    type: String
  },
  assignedRoute: {
    type: String,
    enum: [
      'Puttalam Town to Kurunegala',
      'Kandy Town to Kurunegala',
      'Matale Town to Kurunegala',
      'Ibbagamuwa Town to Kurunegala',
      'Polgahawela to Kurunegala'
    ]
  },
  driverStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  // Location tracking for drivers
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    lastUpdated: { type: Date }
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
