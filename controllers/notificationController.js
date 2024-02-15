var admin = require("firebase-admin");
var fcm = require("fcm-notification");

var serviceAccount = require("../config/notificationKey.json");
const NotificationServices = require("../services/notificationServices");
const NotificationModel = require("../models/notification");
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);

// Generate Notification ID
const generateNotificationId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const NotificationId = `${timestamp}${random}`;
    return NotificationId;
};

exports.sendNotification = (req, res, next) => {
    try {
        const { userId, orderStatus, orderId, orderLocation } = req.body;
        let message = {
            notification: {
                title: "Your Laundry is Ready for " + orderStatus + "!",
                body: "Order #" + orderId + " is now ready for " + orderStatus + " at " + orderLocation + "!"
            },
            data: {
                title: "Your Laundry is Ready for " + orderStatus + "!",
                message: "Order #" + orderId + " is now ready for " + orderStatus + " at " + orderLocation + "!"
            },
            token: req.body.fcm_token,
        };

        FCM.send(message, function(err, resp) {
            if (err) {
                return res.status(500).send({
                    message: err
                });
            } else {
                const notificationId = generateNotificationId();
                NotificationServices.saveNotification(notificationId, userId, message.data.title, message.data.message)
                return res.status(200).send({
                    message: "Notification Sent and Saved"
                });
            }
        });
    } catch (err) {
        throw err;
    }
}

exports.retrieveNotifications = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const notifications = await NotificationModel.find({'user.userId': userId });
        for (const notification of notifications) {
            await NotificationModel.findOneAndUpdate(
                { notificationId: notification.notificationId },
                { $set: { isRead: true } },
                { new: false }
            );
        }
        res.json({ notifications });
    } catch (error) {
        console.log (error);
    }
}

exports.deleteAllNotifications = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        await NotificationModel.deleteMany({ 'user.userId': userId });
        res.status(200).json({ message: 'Notifications deleted successfully.' });
      } catch (error) {
        console.error('Error deleting notifications:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}