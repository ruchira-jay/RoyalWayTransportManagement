const express = require('express');
const {
  getAllAttendanceReports,
  getAttendanceReportByDate,
  getDashboardStats
} = require('../controllers/adminController');

const router = express.Router();

// Admin dashboard stats
router.get('/stats', getDashboardStats);

// Attendance reports
router.get('/reports', getAllAttendanceReports);
router.get('/reports/:date', getAttendanceReportByDate);

module.exports = router;
