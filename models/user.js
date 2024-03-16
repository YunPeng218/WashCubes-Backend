const mongoose = require('mongoose');

// DEFINE SERVICE MODEL
const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    profilePicURL: {
        type: String,
        default: 'https://res.cloudinary.com/ddweldfmx/image/upload/v1710620494/default-avatar-icon-of-social-media-user-vector_it6wvz.jpg'
    },
    fcmTokens: [
        {
            type: String,
        }
    ]
});

const UserModel = mongoose.model('user', userSchema);

// EXPORT SERVICE MODEL
module.exports = UserModel;