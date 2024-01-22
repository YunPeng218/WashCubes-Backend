var admin = require("firebase-admin");
var fcm = require("fcm-notification");

var serviceAccount = require("../config/notificationKey.json");
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);

exports.sendNotification = (req, res, next) => {
    try {
        const { orderStatus, orderID, orderLocation } = req.body;
        let message = {
            notification: {
                title: "Your Laundry is Ready for " + orderStatus + "!",
                body: "Order #" + orderID + " is now ready for " + orderStatus + " at " + orderLocation + "!"
            },
            data: {
                title: "Your Laundry is Ready for " + orderStatus + "!",
                body: "Order #" + orderID + " is now ready for " + orderStatus + " at " + orderLocation + "!"
            },
            token: req.body.fcm_token,
        };

        FCM.send(message, function(err, resp) {
            if (err) {
                return res.status(500).send({
                    message: err
                });
            } else {
                return res.status(200).send({
                    message: "Notification Sent"
                });
            }
        });
    } catch (err) {
        throw err;
    }
}