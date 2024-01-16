
// IMPORT ENVIRONMENT VARIABLES
require('dotenv').config();

//const UserServices = require('../services/userServices')
const UserModel = require('../models/user')
const otpGenerator = require('otp-generator')
//const accountSid = 'ACd5af2db3ad62473f9cff03b7ec2753a3';
//const authToken = 'e9339a6011e2d5c02c3a9af0eb611e55';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const UserServices = require('../services/userServices');

const client = require('twilio')(accountSid, authToken);
let currentNum, otpGenerated = null;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.otpGenerate = async (req, res, next) => {
    try {
        if (currentNum == null) {
            const { phoneNumber } = req.body;
            currentNum = phoneNumber;
        }
        console.log('Called');
        otpGenerated = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        client.messages
            .create({
                body: otpGenerated + ' is your OTP code. The OTP code generated is valid for 1 minute.',
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+' + currentNum
            });
        await sleep(60000)
        otpGenerated = null;
    } catch (error) {
        console.log("---> err -->", error);
        next(error);
    }
}

exports.otpVerification = async (req, res, next) => {
    try {
        const { otpRes } = req.body;
        if (otpGenerated == otpRes) {
            const user = await UserServices.registerUser(currentNum);
            let tokenData = { _id: user._id, phoneNumber: user.phoneNumber };
            const token = await UserServices.generateToken(tokenData, "secretKey")
            res.status(200).json({ status: true, token: token })
        } else
            res.json({ status: false });
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