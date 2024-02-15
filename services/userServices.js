const UserModel = require('../models/user')
const jwt = require('jsonwebtoken')

class UserServices {
    static async validateUser(phoneNumber, fcmToken) {
        try {
            let user = await UserModel.findOne({ phoneNumber });
            if (user) {
                if (!user.fcmTokens.includes(fcmToken)) {
                    user.fcmTokens.push(fcmToken);
                    await user.save();
                }
                return { user, isNewUser: false };
            } else {
                const createUser = new UserModel({ phoneNumber, fcmTokens: [fcmToken] });
                await createUser.save();
                const newUser = await UserModel.findOne({ phoneNumber });
                return { user: newUser, isNewUser: true };
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