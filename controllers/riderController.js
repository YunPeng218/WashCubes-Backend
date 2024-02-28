const RiderServices = require('../services/riderServices');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const duplicate = await RiderServices.checkRider(email);
        if (duplicate) {
            throw new Error(`Email: ${email}, Already Registered`)
        }
        const response = await RiderServices.registerRider(email, password);
        res.status(200).json({ status: true, success: 'Rider registered successfully' });
    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const rider = await RiderServices.checkRider(email);
        if (!rider) {
            res.status(500).json({ status: false });
            return;
        }
        const isPasswordCorrect = await rider.comparePassword(password);
        if (!isPasswordCorrect) {
            res.status(500).json({ status: false });
            return;
        }
        // Creating Token
        let tokenData = { _id: rider._id, email: rider.email };
        const token = await RiderServices.generateAccessToken(tokenData,"secretKey")
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
        const rider = await RiderServices.checkRider(email);
        if (!rider) {
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
        const success = await RiderServices.updateRiderPassword(email, newPassword);
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