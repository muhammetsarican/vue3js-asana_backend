const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    full_name: String,
    password: {
        type: String,
        select: false
    },
    email: String,
    profile_photo: String
},
    {
        versionKey: false,
        timestamps: true
    })

module.exports = mongoose.model("user", UserSchema);