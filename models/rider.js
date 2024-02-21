const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// DEFINE SERVICE MODEL
const riderSchema = new mongoose.Schema({
    phoneNumber: {
        type: Number,
    },
    name: {
        type: String,
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

// Used to encrypt riders' password
riderSchema.pre("save", async function () {
    var rider = this;
    if(!rider.isModified("password")){
        return
    }
    try{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(rider.password, salt);
        rider.password = hash;
    }catch(err){
        throw err;
    }
});

// Used to decrypt password for login validation
riderSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

riderSchema.methods.updatePassword = async function(newPassword) {
    try {
        this.password = newPassword;
        await this.save();
    } catch (error) {
        throw error;
    }
};

const RiderModel = mongoose.model('rider', riderSchema);

// EXPORT SERVICE MODEL
module.exports = RiderModel;