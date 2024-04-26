var admin = require("firebase-admin");
var fcm = require("fcm-notification");
require('dotenv').config();
const NotificationServices = require("../services/notificationServices");
const NotificationModel = require("../models/notification");
const UserModel = require("../models/user");
const certPath = admin.credential.cert({
    "type": "service_account",
    "project_id": "washcubes-3b1fb",
    "private_key_id": "7f3c82a3fe93e9f00a80ef46a1dd1db7429c5433",
    "private_key": process.env.FCM_KEY,
    "client_email": "firebase-adminsdk-wq4lm@washcubes-3b1fb.iam.gserviceaccount.com",
    "client_id": "114276203861124519930",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wq4lm%40washcubes-3b1fb.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  });
var FCM = new fcm(certPath);

// Generate Notification ID
const generateNotificationId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const NotificationId = `${timestamp}${random}`;
    return NotificationId;
};

// Return readable order status
function getProperStatus(orderStatus) {
    switch (orderStatus) {
        case "readyForCollection":
            return 'Ready for Collection';
        case "outForDelivery":
            return 'Out for Delivery';
        case "processingComplete":
            return 'Processing Completed';
        case "inProgress":
            return 'in Progress';
        case "collectedByRider":
            return 'Collected by Rider';
        case "orderError":
            return 'Having Error';
    }
}

exports.sendNotification = async (req, res, next) => {
    try {
        const { userId, orderStatus, orderId } = req.body;
        const user = await UserModel.findOne({ "_id": userId });
        const notificationId = generateNotificationId();
        const message = {
            notification: {
                title: "Your Laundry is " + getProperStatus(orderStatus) + "!",
                body: "Order #" + orderId + " is Now " + getProperStatus(orderStatus) + "!"
            },
            data: {
                title: "Your Laundry is " + getProperStatus(orderStatus) + "!",
                message: "Order #" + orderId + " is Now " + getProperStatus(orderStatus) + "!"
            }
        };
        await NotificationServices.saveNotification(notificationId, userId, message.data.title, message.data.message);
        const notificationsPromises = user.fcmTokens.map(async (fcmToken) => {
            message.token = fcmToken;
            return new Promise((resolve, reject) => {
                FCM.send(message, function(err, resp) {
                    if (err) {
                        if (err.code === 'messaging/registration-token-not-registered') {
                            console.warn(`FCM Token ${fcmToken} is not registered.`);
                            resolve();
                        } else {
                            reject(err);
                        }
                    } else {
                        resolve();
                    }
                });
            });
        });
        await Promise.all(notificationsPromises);
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