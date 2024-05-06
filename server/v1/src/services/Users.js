const User = require("../models/Users");

const insert = (userData) => {
    const user = new User(userData);
    return user.save();
}

const list = () => {
    return User.find({});
}

const loginUser = (userData) => {
    return User.findOne(userData);
}

module.exports = {
    insert,
    list,
    loginUser
}