const NotificationModel = require('../models/notification')

class NotificationServices {
    static async saveNotification(notificationID, userID, title, message) {
        try {
            const notification = new NotificationModel({
                notificationID: notificationID,
                user: {
                    userID: userID,
                },
                title: title,
                message: message,
            });
            return notification.save();
        } catch (error) {
            throw error;
        }
    }
    static async retrieveNotifications(userId) {
        try {
            const notifications = await NotificationModel.find({ 'user.userID': userId });
            for (const notification of notifications) {
                await NotificationModel.findOneAndUpdate(
                    { notificationID: notification.notificationID },
                    { $set: { isRead: true } },
                    { new: true }
                );
            }
            return notifications;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = NotificationServices;