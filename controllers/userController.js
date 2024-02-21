
// IMPORT ENVIRONMENT VARIABLES
require('dotenv').config();

const UserModel = require('../models/user')
const otpGenerator = require('otp-generator')
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const UserServices = require('../services/userServices');

const client = require('twilio')(accountSid, authToken);

exports.sendOTP = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        otpGenerated = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        client.messages
            .create({
                body: otpGenerated + ' is your OTP. The OTP generated is valid for 1 minute.',
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+' + phoneNumber
            });
        res.status(200).json({ status: "Sent", otp: otpGenerated });
    } catch (error) {
        console.log("---> err -->", error);
        next(error);
    }
}

exports.userVerification = async (req, res, next) => {
    try {
        const { phoneNumber, fcmToken } = req.body;
        const {user, isNewUser} = await UserServices.validateUser(phoneNumber, fcmToken);
        let tokenData = { _id: user._id, phoneNumber: user.phoneNumber};
        const token = await UserServices.generateToken(tokenData, "secretKey")
        const status = isNewUser? "newUser" : "existingUser";
        res.status(200).json({ status, token: token })
    } catch (error) {
        console.log("---> err -->", error);
        next(error);
    }
}

exports.getUserDetails = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const user = await UserModel.findById(userId);
        if (user) res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.editUserDetails = async (req, res, next) => {
    try {
        const { userId, name, email } = req.body;
        const user = await UserModel.findById(userId);
        if (user) {
            user.name = name;
            user.email = email;
            user.save();
            res.status(200).json({ user });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.editPhoneNumber = async (req, res, next) => {
    try {
        console.log('hello');
        const { userId, phoneNumber } = req.body;
        const user = await UserModel.findById(userId);
        if (user) {
            user.phoneNumber = phoneNumber;
            user.save();
            res.status(200).json({ status: 'Success' });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.editUserProfilePic = async (req, res, next) => {
    try {
        const { userId, profilePicURL } = req.body;
        const user = await UserModel.findById(userId);
        if (user) {
            user.profilePicURL = profilePicURL;
            user.save();
            res.status(200).json({ user });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.deleteFCMToken = async (req, res, next) => {
    try {
        const { userId, fcmToken } = req.body;
        const user = await UserModel.findById(userId);
            if (user) {
                user.fcmTokens = user.fcmTokens.filter(t => t !== fcmToken);
                await user.save();
            } else {
                console.error(`User not found with ID: ${userId}`);
            }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.addFCMToken = async (req, res, next) => {
    try {
        const { userId, fcmToken } = req.body;
        const user = await UserModel.findById(userId);
        if (user) {
            if (!user.fcmTokens.includes(fcmToken)) {
                user.fcmTokens.push(fcmToken);
                await user.save();
                console.log('FCM token added successfully')
            } else {
                console.log('FCM token already exists')
            }
        } else {
            console.error(`User not found with ID: ${userId}`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}