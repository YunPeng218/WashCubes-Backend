const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// DEFINE SERVICE MODEL
const adminSchema = new mongoose.Schema({
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
        required: true
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
        default: 'https://res.cloudinary.com/ddweldfmx/image/upload/v1707480915/profilePic/zxltbifbulr4m45lbsqq.png'
    }
});

// Used to encrypt admins' password
adminSchema.pre("save", async function () {
    var admin = this;
    if (!admin.isModified("password")) {
        return
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(admin.password, salt);
        admin.password = hash;
    } catch (err) {
        throw err;
    }
});

// Used to decrypt password for login validation
adminSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

adminSchema.methods.updatePassword = async function (newPassword) {
    try {
        this.password = newPassword;
        await this.save();
    } catch (error) {
        throw error;
    }
};

const AdminModel = mongoose.model('admin', adminSchema);

// EXPORT SERVICE MODEL
module.exports = AdminModel;