const httpStatus = require("http-status")
const ApiError = require("../errors/apiError")

const IdChecker = (field) => (req, res, next) => {
    if (!req?.params[field || "id"]?.match(/^[0-9a-fA-F]{24}$/)) return next(new ApiError("Please provide valid id!", httpStatus.BAD_REQUEST));
    next();
}

module.exports = IdChecker;