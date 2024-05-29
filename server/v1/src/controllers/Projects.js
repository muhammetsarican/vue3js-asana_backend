const ApiError = require("../errors/apiError");
const ProjectService = require("../services/ProjectService");
const httpStatus = require("http-status");

const index = (req, res, next) => {
    ProjectService.list()
        .then(response => {
            res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)));
}

const create = (req, res) => {
    req.body.user_id = req.user;
    ProjectService.insert(req.body)
        .then(response => {
            res.status(httpStatus.CREATED).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)));
}

const update = (req, res, next) => {
    if (!req.params.id) return next(new ApiError("Id information not found!", httpStatus.BAD_REQUEST));

    ProjectService.modify(req.body, req.params.id)
        .then(response => {
            res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)));
}

const deleteProject = (req, res) => {
    if (!req.params.id) return next(new ApiError("Id information not found!", httpStatus.BAD_REQUEST));

    ProjectService.remove(req.params.id)
        .then(response => {
            return res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)))
}

module.exports = {
    create,
    index,
    update,
    deleteProject
}