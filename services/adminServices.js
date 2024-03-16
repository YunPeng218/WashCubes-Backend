const AdminModel = require("../models/admin");
const jwt = require('jsonwebtoken')

class AdminServices{
    static async registerAdmin(email, password, icNumber, phoneNumber, name){
        try{
            const newAdmin = new AdminModel({ email, password, icNumber, phoneNumber, name });
            return await newAdmin.save();
        }catch(err){
            throw err;
        }
    }

    static async checkAdmin(email){
        try {
            let admin = await AdminModel.findOne({ email });
            return admin;
        } catch (error) {
            throw error;
        }
    }

    static async generateAccessToken(tokenData, secretKey){
        return jwt.sign(tokenData, secretKey);
    }

    static async updateAdminPassword(email, oldPassword, newPassword) {
        try {
            const admin = await AdminModel.findOne({ email });
            const isPasswordCorrect = await admin.comparePassword(oldPassword);
            if (isPasswordCorrect) {
                await admin.updatePassword(newPassword);
                return { status: 'Password updated successfully' };
            }
        } catch (error) {
            throw error;
        }
    }
}
module.exports = AdminServices;