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
        default: 'https://res.cloudinary.com/ddweldfmx/image/upload/v1707480915/profilePic/zxltbifbulr4m45lbsqq.png'
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