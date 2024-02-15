const express = require('express');
const router = express.Router();

const NotificationController = require('../controllers/notificationController');

router.post('/sendNotification', NotificationController.sendNotification);
router.get('/fetchNotification', NotificationController.retrieveNotifications);
router.delete('/deleteAllNotifications', NotificationController.deleteAllNotifications);

module.exports = router;