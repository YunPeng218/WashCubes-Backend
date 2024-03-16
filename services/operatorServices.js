const OperatorModel = require("../models/operator");
const jwt = require('jsonwebtoken')

class OperatorServices{
    static async registerOperator(email, password, phoneNumber, icNumber, name, profilePicURL){
        try{
            const newOperator = new OperatorModel({ email, password, phoneNumber, icNumber, name, profilePicURL });
            return await newOperator.save();
        }catch(err){
            throw err;
        }
    }

    static async checkOperator(email, phoneNumber, icNumber){
        try {
            let operatorWithEmail = await OperatorModel.findOne({ email });
            let operatorWithPhoneNumber = await OperatorModel.findOne({ phoneNumber });
            let operatorWithicNumber = await OperatorModel.findOne({ icNumber })
            if (operatorWithEmail || operatorWithPhoneNumber || operatorWithicNumber) {
                return true
            }
        } catch (error) {
            throw error;
        }
    }

    static async generateAccessToken(tokenData, secretKey){
        return jwt.sign(tokenData, secretKey);
    }

    static async updateOperatorPassword(email, oldPassword, newPassword) {
        try {
            const operator = await OpertorModel.findOne({ email });
            const isPasswordCorrect = await operator.comparePassword(oldPassword);
            if (isPasswordCorrect) {
                await operator.updatePassword(newPassword);
                return { status: 'Password updated successfully' };
            }
        } catch (error) {
            throw error;
        }
    }
}
module.exports = OperatorServices;