const OperatorModel = require("../models/operator");

class OperatorServices{
    static async registerOperator(email, password){
        try{
            const newOperator = new OperatorModel({ email, password });
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