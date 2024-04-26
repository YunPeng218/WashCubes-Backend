const AdminServices = require('../services/adminServices');
const AdminModel = require('../models/admin');

exports.register = async (req, res, next) => {
    try {
        const { email, password, icNumber, phoneNumber, name } = req.body;
        const duplicate = await AdminServices.checkAdmin(email);
        if (duplicate) {
            throw new Error(`Email: ${email}, Already Registered`)
        } else {
            await AdminServices.registerAdmin(email, password, icNumber, phoneNumber, name );
            res.status(200).json({ status: true, success: 'Admin registered successfully' });
        }
    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminServices.checkAdmin(email);
        if (!admin) {
            res.status(500).json({ status: false });
            return;
        }
        const isPasswordCorrect = await admin.comparePassword(password);
        if (!isPasswordCorrect) {
            res.status(500).json({ status: false });
            return;
        }
        // Creating Token
        let tokenData = { _id: admin._id, email: admin.email, profilePicUrl: admin.profilePicURL };
        const token = await AdminServices.generateAccessToken(tokenData,"secretKey")
        res.status(200).json({ status: true, token: token });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const {email, oldPassword, newPassword} = req.body;
        const success = await AdminServices.updateAdminPassword(email, oldPassword, newPassword);
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

exports.getAdminDetails = async (req, res, next) => {
    try {
        const adminId = req.query.adminId;
        const admin = await AdminModel.findById(adminId);
        if (admin) res.status(200).json({ admin });
    } catch (error) {
        console.error(error);
        next(error);
    }
}