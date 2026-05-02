const express = require('express');
const { register, login, adminLogin, getDriverByRoute } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/driver/route/:route', getDriverByRoute);

module.exports = router;
