const httpStatus = require("http-status");
const ApiError = require("../errors/apiError");
const { passwordToHash } = require("../scripts/utils/helper");

class BaseController {
    constructor(Service, isUserService) {
        this.Service = Service;
        if (isUserService) this.isUser = isUserService;
    }

    index(field) {
        return (req, res, next) => {
            this.Service.list(field ? { [field]: req.params[field] } : {})
                .then(response => {
                    res.status(httpStatus.OK).send({
                        success: true,
                        message: response
                    });
                })
                .catch(err => next(new ApiError(err?.message)));
        }
    }

    create() {
        return (req, res, next) => {
            this.isUser ? req.body.password = passwordToHash(req.body.password) : req.body.user_id = req.user;
            this.Service.insert(req.body)
                .then(response => {
                    res.status(httpStatus.CREATED).send({
                        success: true,
                        message: response
                    });
                })
                .catch(err => next(new ApiError(err?.message)));
        }
    }

    update() {
        return (req, res, next) => {
            this.Service.modify(req.body, this.isUser ? { _id: req.user._id } : req.params.id)
                .then(response => {
                    res.status(httpStatus.OK).send({
                        success: true,
                        message: response
                    });
                })
                .catch(err => next(new ApiError(err?.message)));
        }
    }

    delete() {
        return (req, res, next) => {
            this.Service.remove(req.params.id)
                .then(response => {
                    return res.status(httpStatus.OK).send({
                        success: true,
                        message: response
                    });
                })
                .catch(err => next(new ApiError(err?.message)))
        }
    }
}

module.exports = BaseController;
