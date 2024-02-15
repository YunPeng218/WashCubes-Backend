var admin = require("firebase-admin");
var fcm = require("fcm-notification");

var serviceAccount = require("../config/notificationKey.json");
const NotificationServices = require("../services/notificationServices");
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);

// Generate Notification ID
const generateNotificationID = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const NotificationID = `${timestamp}${random}`;
    return NotificationID;
};

exports.sendNotification = (req, res, next) => {
    try {
        const { userID, orderStatus, orderID, orderLocation } = req.body;
        let message = {
            notification: {
                title: "Your Laundry is Ready for " + orderStatus + "!",
                body: "Order #" + orderID + " is now ready for " + orderStatus + " at " + orderLocation + "!"
            },
            data: {
                title: "Your Laundry is Ready for " + orderStatus + "!",
                message: "Order #" + orderID + " is now ready for " + orderStatus + " at " + orderLocation + "!"
            },
            token: req.body.fcm_token,
        };

        FCM.send(message, function(err, resp) {
            if (err) {
                return res.status(500).send({
                    message: err
                });
            } else {
                const notificationID = generateNotificationID();
                NotificationServices.saveNotification(notificationID, userID, message.data.title, message.data.message)
                return res.status(200).send({
                    message: "Notification Sent and Saved"
                });
            }
        });
    } catch (err) {
        throw err;
    }
}