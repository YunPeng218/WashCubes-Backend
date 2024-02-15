const express = require('express');
const router = express.Router();

const NotificationController = require('../controllers/notificationController');

router.post('/sendNotification', NotificationController.sendNotification);
// router.get('/notification', NotificationController.getNotification);

module.exports = router;