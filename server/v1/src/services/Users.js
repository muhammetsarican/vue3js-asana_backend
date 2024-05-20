const User = require("../models/Users");
const path = require("path");

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

const modify = (where, data) => {
    return User.findOneAndUpdate(where, data, { new: true })
}

const remove = (id) => {
    return User.findOneAndDelete(id, { new: true });
}

const updateImage = () => {
    console.log(__dirname);
    console.log(path.join(__dirname, "../", "uploads/users"))
}
module.exports = {
    insert,
    list,
    loginUser,
    modify,
    remove,
    updateImage
}