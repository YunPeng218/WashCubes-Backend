const OperatorModel = require("../models/operator");
const jwt = require('jsonwebtoken')

class OperatorServices{
    static async registerOperator(email, password, icNumber, phoneNumber, name){
        try{
            const newOperator = new OperatorModel({ email, password, icNumber, phoneNumber, name });
            return await newOperator.save();
        }catch(err){
            throw err;
        }
    }

    static async checkOperator(email){
        try {
            let operator = await OperatorModel.findOne({ email });
            return operator;
        } catch (error) {
            throw error;
        }
    }

    static async generateAccessToken(tokenData, secretKey){
        return jwt.sign(tokenData, secretKey);
    }

    static async updateOperatorPassword(email, newPassword) {
        try {
            const operator = await OpertorModel.findOne({ email });
            await operator.updatePassword(newPassword);
            return { status: 'Password updated successfully' };
        } catch (error) {
            throw error;
        }
    }
}
module.exports = OperatorServices;