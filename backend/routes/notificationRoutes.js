const express = require('express');
const {
  sendNotification,
  getAllNotifications,
  getNotificationsByDriver,
  markAsRead,
  deleteNotification
} = require('../controllers/notificationController');

const router = express.Router();

router.post('/send', sendNotification);
router.get('/', getAllNotifications);
router.get('/driver/:driverId', getNotificationsByDriver);
router.put('/read/:id', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
