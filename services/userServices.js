const UserModel = require('../models/user')
const jwt = require('jsonwebtoken')

class UserServices {
    static async registerUser(phoneNumber) {
        try {
            const existingUser = await UserModel.findOne({ phoneNumber });
            if (existingUser) {
                return existingUser;
            } else {
                const createUser = new UserModel({ phoneNumber });
                await createUser.save();
                const newUser = await UserModel.findOne({ phoneNumber });
                return newUser;
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