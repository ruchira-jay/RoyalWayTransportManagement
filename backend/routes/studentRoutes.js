const express = require('express');
const { getAllStudents, getStudentsByDriver, getStudentsByRoute } = require('../controllers/studentController');

const router = express.Router();

router.get('/', getAllStudents);
router.get('/driver/:driverId', getStudentsByDriver);
router.get('/route/:route', getStudentsByRoute);

module.exports = router;
