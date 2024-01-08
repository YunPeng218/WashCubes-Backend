const mongoose = require('mongoose');

// DEFINE SERVICE MODEL
const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: Number,
        required: [true, "Phone number can't be empty"],
        unique: true,
    }
});

const UserModel = mongoose.model('user', userSchema);

// EXPORT SERVICE MODEL
module.exports = UserModel;