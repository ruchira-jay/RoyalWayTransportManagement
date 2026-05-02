const express = require('express');
const router = express.Router();
const {
  updateDriverLocation,
  getDriverLocationByRoute,
  setDriverStatus
} = require('../controllers/locationController');

router.put('/driver/:driverId', updateDriverLocation);
router.get('/route/:route', getDriverLocationByRoute);
router.put('/driver/:driverId/status', setDriverStatus);

module.exports = router;
