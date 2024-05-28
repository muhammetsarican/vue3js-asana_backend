const ProjectService = require("../services/ProjectService");
const httpStatus = require("http-status");

const index = (req, res) => {
    ProjectService.list()
        .then(response => {
            res.status(httpStatus.OK).send(response);
        })
        .catch(err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        })
}

const create = (req, res) => {
    req.body.user_id = req.user;
    ProjectService.insert(req.body)
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
    ProjectService.modify(req.body, req.params.id)
        .then(response => {
            res.status(httpStatus.OK).send(response);
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: "An error occured during save operation."
        }))
}

const deleteProject = (req, res) => {
    if (!req.params.id) return res.status(httpStatus.BAD_REQUEST).send({
        message: "Id information not found!"
    })
    ProjectService.remove(req.params.id)
        .then(removeResponse => {
            return res.status(httpStatus.OK).send(removeResponse);
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: `An error occured during remove operation. Error is ${err}`
        }))
}

module.exports = {
    create,
    index,
    update,
    deleteProject
}