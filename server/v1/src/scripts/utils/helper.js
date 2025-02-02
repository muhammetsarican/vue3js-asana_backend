const cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");

const passwordToHash = (password) => {
    return cryptojs.HmacSHA256(password, cryptojs.HmacSHA1(password, process.env.PASSWORD_HASH).toString()).toString();
};

const generateAccessToken = (user) => {
    return jwt.sign({ name: user.email, ...user }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1w" });
};
const generateRefreshToken = (user) => {
    return jwt.sign({ name: user.email, ...user }, process.env.REFRESH_TOKEN_SECRET_KEY);
};

module.exports = {
    passwordToHash,
    generateAccessToken,
    generateRefreshToken
}