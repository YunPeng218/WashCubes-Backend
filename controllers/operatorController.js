const OperatorServices = require('../services/operatorServices');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const OperatorModel = require('../models/operator');

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const duplicate = await OperatorServices.checkOperator(email);
        if (duplicate) {
            throw new Error(`Email: ${email}, Already Registered`)
        } else {
            await OperatorServices.registerOperator(email, password);
            res.status(200).json({ status: true, success: 'Operator registered successfully' });
        }
    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const operator = await OperatorServices.checkOperator(email);
        if (!operator) {
            res.status(500).json({ status: false });
            return;
        }
        const isPasswordCorrect = await operator.comparePassword(password);
        if (!isPasswordCorrect) {
            res.status(500).json({ status: false });
            return;
        }
        // Creating Token
        let tokenData = { _id: operator._id, email: operator.email };
        const token = await OperatorServices.generateAccessToken(tokenData,"secretKey")
        res.status(200).json({ status: true, token: token });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
}

async function sendOtpEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
            user: 'washcubes@hotmail.com',
            pass: 'i3Cubes218'
        }
    })

    const content = await transporter.sendMail({
        from: "washcubes@hotmail.com",
        to: email,
        subject: "Reset Your Password",
        text: 'Your OTP for password reset is ' + otp + '. The OTP generated is valid for 5 minutes.'
    })
}

exports.resetPassRequest = async (req, res, next) => {
    try {
        const email = req.body.email;
        const operator = await OperatorServices.checkOperator(email);
        if (!operator) {
            res.status(500).json({ status: "NotFound" });
            return;
        }
        otpGenerated = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        sendOtpEmail(email, otpGenerated);
        res.status(200).json({ status: "Sent", otp: otpGenerated });
    } catch (e) {
        next(e);
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const {email, newPassword} = req.body;
        const success = await OperatorServices.updateOperatorPassword(email, newPassword);
        if (success) {
            res.status(200).json({ status: 'Success' });
        } else {
            res.status(500).json({ status: 'Failed' });
        }
    } catch (error) {
        console.log("---> err -->", error);
        next(error);
    }
}

exports.getOperatorDetails = async (req, res, next) => {
    try {
        const operatorId = req.query.operatorId;
        const operator = await OperatorModel.findById(operatorId);
        if (operator) res.status(200).json({ operator });
    } catch (error) {
        console.error(error);
        next(error);
    }
}