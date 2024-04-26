const OperatorServices = require('../services/operatorServices');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const OperatorModel = require('../models/operator');

exports.register = async (req, res, next) => {
    try {
        const { email, password, icNumber, phoneNumber, name, profilePicURL } = req.body;
        const duplicate = await OperatorServices.checkDuplicate(email, phoneNumber, icNumber);
        if (duplicate == true) {
            throw new Error(`Email: ${email} or Phone Number: ${phoneNumber} or IC Number: ${icNumber} Already Registered`)
        } else {
            await OperatorServices.registerOperator(email, password, phoneNumber, icNumber, name, profilePicURL);
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
        let tokenData = { _id: operator._id, email: operator.email, profilePicUrl: operator.profilePicURL };
        const token = await OperatorServices.generateAccessToken(tokenData,"secretKey")
        res.status(200).json({ status: true, token: token });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const {email, oldPassword, newPassword} = req.body;
        const success = await OperatorServices.updateOperatorPassword(email, oldPassword, newPassword);
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

exports.displayAllOperatorsForAdmin = async (req, res) => {
    try {
        const operators = await OperatorModel.find({});
        res.status(200).json({ operators });
    } catch (error) {
        console.error('Error retrieving operators:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.deleteOperatorAccount = async (req, res, next) => {
    try {
        const { email } = req.body;
        const deletedOperator = await OperatorModel.findOneAndDelete({ email: email });
        if (deletedOperator) {
            res.status(200).json({ status: 'Success', message: 'Operator account deleted successfully' });
        } else {
            res.status(404).json({ status: 'Not Found', message: 'Operator not found' });
        }
    } catch (error) {
        console.error('Error deleting operator account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}