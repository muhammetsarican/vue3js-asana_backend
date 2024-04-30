const { insert } = require("../services/Projects");
const httpStatus = require("http-status");

const index = (req, res) => {
    res.status(200).send("Project Index");
}
const create = (req, res) => {
    insert(req.body)
        .then(response => {
            res.status(httpStatus.CREATED).send(response);
        })
        .catch(err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        })
}

module.exports = {
    create,
    index
}