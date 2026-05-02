const express = require('express');
const {
  markMorningPickup,
  markMorningDropoff,
  markEveningPickup,
  markEveningDropoff,
  markAbsent,
  getTodayAttendanceForDriver,
  getMorningAttendanceReport,
  getChildAttendance,
  getAttendanceByDate,
  resetTodayAttendance
} = require('../controllers/attendanceController');

const router = express.Router();

// Mark actions
router.post('/morning-pickup/:studentId', markMorningPickup);
router.post('/morning-dropoff/:studentId', markMorningDropoff);
router.post('/evening-pickup/:studentId', markEveningPickup);
router.post('/evening-dropoff/:studentId', markEveningDropoff);
router.post('/absent/:studentId', markAbsent);

// Get attendance
router.get('/driver/:driverId/today', getTodayAttendanceForDriver);
router.get('/driver/:driverId/morning-report', getMorningAttendanceReport);
router.get('/driver/:driverId/date/:date', getAttendanceByDate);
router.get('/parent/:parentId/child', getChildAttendance);

// Reset attendance
router.post('/driver/:driverId/reset-today', resetTodayAttendance);

module.exports = router;
