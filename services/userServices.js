const UserModel = require('../models/user')
const jwt = require('jsonwebtoken')

class UserServices {
    static async validateUser(phoneNumber) {
        try {
            const existingUser = await UserModel.findOne({ phoneNumber });
            if (existingUser) {
                return {user: existingUser, isNewUser: false};
            } else {
                const createUser = new UserModel({ phoneNumber });
                await createUser.save();
                const newUser = await UserModel.findOne({ phoneNumber });
                return {user: newUser, isNewUser: true};
            }
        } catch (error) {
            throw error;
        }
    }

    static async generateToken(tokenData, secretKey) {
        return jwt.sign(tokenData, secretKey);
    }
}

module.exports = UserServices;