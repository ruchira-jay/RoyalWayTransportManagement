const User = require('../models/User');

// Update driver location
const updateDriverLocation = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.currentLocation = {
      latitude,
      longitude,
      lastUpdated: new Date()
    };
    driver.isOnline = true;

    await driver.save();

    res.json({ 
      message: 'Location updated successfully',
      location: driver.currentLocation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get driver location by route
const getDriverLocationByRoute = async (req, res) => {
  try {
    const { route } = req.params;

    const driver = await User.findOne({ 
      assignedRoute: decodeURIComponent(route),
      role: 'driver',
      isOnline: true
    }).select('name phoneNumber assignedRoute currentLocation isOnline');

    if (!driver) {
      return res.status(404).json({ message: 'No active driver found for this route' });
    }

    // Check if location is recent (within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (driver.currentLocation?.lastUpdated < fiveMinutesAgo) {
      return res.status(404).json({ message: 'Driver location not available' });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set driver online/offline status
const setDriverStatus = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { isOnline } = req.body;

    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.isOnline = isOnline;
    await driver.save();

    res.json({ 
      message: `Driver is now ${isOnline ? 'online' : 'offline'}`,
      isOnline: driver.isOnline
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateDriverLocation,
  getDriverLocationByRoute,
  setDriverStatus
};
