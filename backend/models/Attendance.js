const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    }
  },
  // Morning session
  morningPickup: {
    status: {
      type: String,
      enum: ['pending', 'picked', 'absent'],
      default: 'pending'
    },
    time: Date
  },
  morningDropoff: {
    status: {
      type: String,
      enum: ['pending', 'dropped', 'absent'],
      default: 'pending'
    },
    time: Date
  },
  // Evening session
  eveningPickup: {
    status: {
      type: String,
      enum: ['pending', 'picked', 'absent'],
      default: 'pending'
    },
    time: Date
  },
  eveningDropoff: {
    status: {
      type: String,
      enum: ['pending', 'dropped', 'absent'],
      default: 'pending'
    },
    time: Date
  },
  // Overall status for the day
  isAbsent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one record per student per day
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
