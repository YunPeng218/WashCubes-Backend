const AdminModel = require("../models/admin");

class AdminServices{
    static async registerAdmin(email, password){
        try{
            const newAdmin = new AdminModel({ email, password });
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

    static async updateAdminPassword(email, newPassword) {
        try {
            const admin = await AdminModel.findOne({ email });
            await admin.updatePassword(newPassword);
            return { status: 'Password updated successfully' };
        } catch (error) {
            throw error;
        }
    }
}
module.exports = AdminServices;