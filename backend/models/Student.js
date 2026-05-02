const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true,
    trim: true
  },
  childName: {
    type: String,
    required: [true, 'Child name is required'],
    trim: true
  },
  parentName: {
    type: String,
    required: [true, 'Parent name is required'],
    trim: true
  },
  childClass: {
    type: String,
    required: [true, 'Class is required'],
    trim: true
  },
  childDateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  route: {
    type: String,
    required: [true, 'Route is required'],
    enum: [
      'Puttalam Town to Kurunegala',
      'Kandy Town to Kurunegala',
      'Matale Town to Kurunegala',
      'Ibbagamuwa Town to Kurunegala',
      'Polgahawela to Kurunegala'
    ]
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Parent ID is required']
  },
  parentEmail: {
    type: String
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);
