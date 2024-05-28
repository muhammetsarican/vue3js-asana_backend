const SectionService = require("../services/SectionService");
const httpStatus = require("http-status");

const index = (req, res) => {
    if (!req?.params?.project_id) return res.status(httpStatus.BAD_REQUEST).send({
        error: "Project id is required, please provide it!"
    })
    SectionService.list({ project_id: req.params.project_id })
        .then(response => {
            res.status(httpStatus.OK).send(response);
        })
        .catch(err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        })
}

const create = (req, res) => {
    req.body.user_id = req.user;
    SectionService.insert(req.body)
        .then(response => {
            res.status(httpStatus.CREATED).send(response);
        })
        .catch(err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        })
}

const update = (req, res) => {
    console.log(req.params.id);
    if (!req.params.id) {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: "Id information not found!"
        })
    }
    SectionService.modify(req.body, req.params.id)
        .then(response => {
            res.status(httpStatus.OK).send(response);
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: "An error occured during save operation."
        }))
}

const deleteSection = (req, res) => {
    if (!req.params.id) return res.status(httpStatus.BAD_REQUEST).send({
        message: "Id information not found!"
    })
    SectionService.remove(req.params.id)
        .then(removeResponse => {
            return res.status(httpStatus.OK).send({
                message: "Delete operation successfull",
                data: removeResponse
            });
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: `An error occured during remove operation. Error is ${err}`
        }))
}

module.exports = {
    create,
    index,
    update,
    deleteSection
}