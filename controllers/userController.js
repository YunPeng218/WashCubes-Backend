
// IMPORT ENVIRONMENT VARIABLES
require('dotenv').config();

//const UserServices = require('../services/userServices')
const UserModel = require('../models/user')
const otpGenerator = require('otp-generator')
const accountSid = 'ACd5af2db3ad62473f9cff03b7ec2753a3';
const authToken = 'e9339a6011e2d5c02c3a9af0eb611e55';
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);
let currentNum, otpGenerated = null;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.otpVerification = async (req, res, next) => {
    try {
        if (currentNum==null) {
            const { phoneNumber } = req.body;
            currentNum = phoneNumber;
        }
        otpGenerated = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        client.messages
            .create({
            body: otpGenerated +' is your OTP code. The OTP code generated is valid for 1 minute.',
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+'+currentNum
            });
        await sleep(60000)
        otpGenerated = null;
    } catch (error) {
        console.log("---> err -->", error);
        next(error);
    }
}

exports.register = async (req, res, next) => {
    try {
        const { otpRes } = req.body;
        if (otpGenerated == otpRes) {
            //await UserServices.registerUser(number);
            await registerUser(currentNum);
            res.json({ status: true, success: "Correct OTP & Registered Successfully" });
        } else 
            res.json({ status: false, success: "Wrong OTP" });
    } catch (error) {
        console.log("---> err -->", error);
        next(error);
    }
}

const registerUser = async (phoneNumber) => {
    try {
        const existingUser = await UserModel.findOne({ phoneNumber });
        if (existingUser) return;
        const createUser = new UserModel({ phoneNumber });
        await createUser.save();
    } catch (error) {
        throw error;
    }
}