const NotificationModel = require('../models/notification')

class NotificationServices {
    static async saveNotification(notificationId, userId, title, message) {
        try {
            const notification = new NotificationModel({
                notificationId: notificationId,
                user: {
                    userId: userId,
                },
                title: title,
                message: message,
            });
            return notification.save();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = NotificationServices;