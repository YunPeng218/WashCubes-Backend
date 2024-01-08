const UserModel = require('../models/user')

class UserServices {
    static async registerUser(phoneNumber){
        try {
            const createUser = new UserModel({phoneNumber});
            return await createUser.save();
        } catch(error){
            throw error;
        }
    }
}

module.exports = UserServices;