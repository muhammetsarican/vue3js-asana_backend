const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (token == null) {
        return res.status(httpStatus.UNAUTHORIZED).send({
            error: "You have to login for do this process."
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if (err) return res.status(httpStatus.FORBIDDEN).send({
            error: err
        })
        req.user = user?._doc;
        next();
    })
}

module.exports = authenticateToken;