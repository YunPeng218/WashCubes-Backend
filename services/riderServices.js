const RiderModel = require("../models/rider");
const jwt = require("jsonwebtoken");

class RiderServices{
    static async registerRider(email, password, phoneNumber, name, profilePicURL){
        try{
            const createRider = new RiderModel({ email, password, phoneNumber, name, profilePicURL});
            return await createRider.save();
        }catch(err){
            throw err;
        }
    }

    static async checkRider(email, phoneNumber){
        try {
            let riderWithEmail = await RiderModel.findOne({ email });
            let riderWithPhoneNumber = await RiderModel.findOne({ phoneNumber });
            if (riderWithEmail || riderWithPhoneNumber) {
                return true
            }
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