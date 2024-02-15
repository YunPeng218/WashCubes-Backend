const mongoose = require('mongoose');

// DEFINE NOTIFICATION MODEL
const notificationSchema = new mongoose.Schema({
    notificationID: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    title: {
        type: String,
    },
    message: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    receivedAt: {
        type: Date,
        default: Date.now
    }
});

const NotificationModel = mongoose.model('notification', notificationSchema);

// EXPORT SERVICE MODEL
module.exports = NotificationModel;