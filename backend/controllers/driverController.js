const User = require('../models/User');

// Get all drivers (for admin)
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' }).select('-password');
    console.log('Found drivers:', drivers.length);
    console.log('First driver:', JSON.stringify(drivers[0], null, 2));
    res.json(drivers);
  } catch (error) {
    console.error('Error getting drivers:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get driver by userId
const getDriverByUserId = async (req, res) => {
  try {
    const driver = await User.findOne({ _id: req.params.userId, role: 'driver' }).select('-password');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve driver (admin only)
const approveDriver = async (req, res) => {
  try {
    const driver = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'driver' },
      { driverStatus: 'approved' },
      { new: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json({
      message: 'Driver approved successfully',
      driver
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject driver (admin only)
const rejectDriver = async (req, res) => {
  try {
    const driver = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'driver' },
      { driverStatus: 'rejected' },
      { new: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json({
      message: 'Driver rejected',
      driver
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDrivers,
  getDriverByUserId,
  approveDriver,
  rejectDriver
};
