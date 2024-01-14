
// IMPORT ENVIRONMENT VARIABLES
require('dotenv').config();

//const UserServices = require('../services/userServices')
const UserModel = require('../models/user')
const otpGenerator = require('otp-generator');
const UserServices = require('../services/userServices');
const accountSid = 'ACd5af2db3ad62473f9cff03b7ec2753a3';
const authToken = '84e46da9b5376fe208c603618953d675';
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);
let currentNum, otpGenerated = null;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.otpGenerate = async (req, res, next) => {
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

exports.otpVerification = async (req, res, next) => {
    try {
        const { otpRes } = req.body;
        if (otpGenerated == otpRes) {
            const user = await UserServices.registerUser(currentNum);
            let tokenData = {_id:user._id};
            const token = await UserServices.generateToken(tokenData, "secretKey")
            res.status(200).json({status: true, token: token})
        } else 
            res.json({ status: false });
    } catch (error) {
        console.log("---> err -->", error);
        next(error);
    }
}