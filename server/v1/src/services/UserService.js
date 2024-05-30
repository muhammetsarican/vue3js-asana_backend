const UserModel = require("../models/Users");
const BaseService = require("./BaseService");

class UserService extends BaseService {
    constructor() {
        super(UserModel);
    }

    loginUser(where) {
        return super.findOne(where);
    }

    modify(data, where) {
        return UserModel.findOneAndUpdate(where, data, { new: true })
    }
}

module.exports = new UserService();