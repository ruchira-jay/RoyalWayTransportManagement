const express = require('express');
const {
  getAllDrivers,
  getDriverByUserId,
  approveDriver,
  rejectDriver
} = require('../controllers/driverController');

const router = express.Router();

router.get('/', getAllDrivers);
router.get('/user/:userId', getDriverByUserId);
router.put('/approve/:id', approveDriver);
router.put('/reject/:id', rejectDriver);

module.exports = router;
