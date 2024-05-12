const { passwordToHash, generateAccessToken, generateRefreshToken } = require("../scripts/utils/helper");
const { insert, list, loginUser, modify } = require("../services/Users");
const httpStatus = require("http-status");
const projectService = require("../services/Projects");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");

const index = (req, res) => {
    list()
        .then(response => {
            res.status(httpStatus.OK).send(response);
        })
        .catch(error => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
        })
};

const create = (req, res) => {
    req.body.password = passwordToHash(req.body.password);

    insert(req.body)
        .then((response) => {
            res.status(httpStatus.CREATED).send(response)
        })
        .catch(error => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
        })
};

const login = (req, res) => {
    req.body.password = passwordToHash(req.body.password);

    loginUser(req.body)
        .then(user => {
            if (!user) return res.status(httpStatus.NOT_FOUND).send("No user exist with this email!");

            user = {
                ...user.toObject(),
                tokens: {
                    access_token: generateAccessToken(user),
                    refresh_token: generateRefreshToken(user)
                }
            }
            delete user.password;
            res.status(httpStatus.OK).send(user);
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err));
}

const projectList = (req, res) => {
    projectService.list({
        user_id: req.user._id
    })
        .then(projects => {
            res.status(httpStatus.OK).send(projects)
        })
        .catch(() => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                error: "An error occured unexptectly during getting projects!"
            })
        })
}

const resetPassword = (req, res) => {
    const newPassword = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
    modify({ email: req.body.email }, { password: passwordToHash(newPassword) })
        .then(updatedUser => {
            if (!updatedUser) return res.status(httpStatus.NOT_FOUND).send({
                error: "No user was found like that!"
            })
            eventEmitter.emit("send_email", {
                to: updatedUser.email,
                subject: "Reset Password",
                html: `At your request, your reset password operation done. <br/> After login, dont forget change your password. <br/> New password: ${newPassword}`
            });
            res.status(httpStatus.OK).send({
                message: "The neccessary information was sended your email for resetting password."
            })
        })
        .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send("An error occured during resetting!"));
}

const update = (req, res) => {
    modify({ _id: req.user._id }, req.body)
        .then(updatedUser => {
            res.status(httpStatus.OK).send(updatedUser)
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: `An error occured during update process! Error: ${err}`
        }))
}

module.exports = {
    create,
    index,
    login,
    projectList,
    resetPassword,
    update
}