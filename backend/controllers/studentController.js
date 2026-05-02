const Student = require('../models/Student');
const User = require('../models/User');

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('parentId', 'name email')
      .populate('assignedDriver', 'name phoneNumber')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get students by driver (based on route)
const getStudentsByDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    
    // Get driver's route
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Get all students on this route
    const students = await Student.find({ route: driver.assignedRoute })
      .populate('parentId', 'name email phoneNumber')
      .sort({ childName: 1 });
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get students by route
const getStudentsByRoute = async (req, res) => {
  try {
    const { route } = req.params;
    const students = await Student.find({ route })
      .populate('parentId', 'name email')
      .sort({ childName: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllStudents, getStudentsByDriver, getStudentsByRoute };
