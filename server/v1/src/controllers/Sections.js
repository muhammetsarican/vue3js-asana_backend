const ApiError = require("../errors/apiError");
const SectionService = require("../services/SectionService");
const httpStatus = require("http-status");

const index = (req, res) => {
    SectionService.list({ project_id: req.params.project_id })
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
    SectionService.insert(req.body)
        .then(response => {
            res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)));
}

const update = (req, res) => {
    SectionService.modify(req.body, req.params.id)
        .then(response => {
            res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)));
}

const deleteSection = (req, res) => {
    SectionService.remove(req.params.id)
        .then(response => {
            res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)));
}

module.exports = {
    create,
    index,
    update,
    deleteSection
}