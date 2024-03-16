const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// DEFINE SERVICE MODEL
const operatorSchema = new mongoose.Schema({
    phoneNumber: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    icNumber: {
        type: String,
        unique: true,
        required: true
    },
    profilePicURL: {
        type: String,
        default: 'https://res.cloudinary.com/ddweldfmx/image/upload/v1710620494/default-avatar-icon-of-social-media-user-vector_it6wvz.jpg'
    }
});

// Used to encrypt operators' password
operatorSchema.pre("save", async function () {
    var operator = this;
    if (!operator.isModified("password")) {
        return
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(operator.password, salt);
        operator.password = hash;
    } catch (err) {
        throw err;
    }
});

// Used to decrypt password for login validation
operatorSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

operatorSchema.methods.updatePassword = async function (newPassword) {
    try {
        this.password = newPassword;
        await this.save();
    } catch (error) {
        throw error;
    }
};

const OperatorModel = mongoose.model('operator', operatorSchema);

// EXPORT SERVICE MODEL
module.exports = OperatorModel;