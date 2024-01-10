
// IMPORT ENVIRONMENT VARIABLES
require('dotenv').config();

//const UserServices = require('../services/userServices')
const UserModel = require('../models/user')
const otpGenerator = require('otp-generator')
//const accountSid = 'ACd5af2db3ad62473f9cff03b7ec2753a3';
//const authToken = '917170b20d98df23fb72ade2fc2a4668';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

exports.otpVerification = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        number = phoneNumber;
        otpGenerated = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        client.messages
            .create({
            body: otpGenerated +' is your OTP code.',
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+'+phoneNumber
            });
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
            await registerUser(number);
            res.json({ status: true, success: "Registered Successfully" });
        }
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