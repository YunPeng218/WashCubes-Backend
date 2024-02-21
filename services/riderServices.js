const RiderModel = require("../models/rider");
const jwt = require("jsonwebtoken");

class RiderServices{
    static async registerRider(email,password){
        try{
            const createRider = new RiderModel({email,password});
            return await createRider.save();
        }catch(err){
            throw err;
        }
    }

    static async checkRider(email){
        try {
            let rider = await RiderModel.findOne({email});
            return rider;
        } catch (error) {
            throw error;
        }
    }

    static async generateAccessToken(tokenData, secretKey){
        return jwt.sign(tokenData, secretKey);
    }

    static async updateRiderPassword(email, newPassword) {
        try {
            const rider = await RiderModel.findOne({ email });
            await rider.updatePassword(newPassword);
            return { status: 'Password updated successfully' };
        } catch (error) {
            throw error;
        }
    }
}
module.exports = RiderServices;