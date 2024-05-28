const { passwordToHash, generateAccessToken, generateRefreshToken } = require("../scripts/utils/helper");
const UserService = require("../services/UserService");
const httpStatus = require("http-status");
const ProjectService = require("../services/ProjectService");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");

const index = (req, res) => {
    UserService.list()
        .then(response => {
            res.status(httpStatus.OK).send(response);
        })
        .catch(error => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
        })
};

const create = (req, res) => {
    req.body.password = passwordToHash(req.body.password);

    UserService.insert(req.body)
        .then((response) => {
            res.status(httpStatus.CREATED).send(response)
        })
        .catch(error => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
        })
};

const login = (req, res) => {
    req.body.password = passwordToHash(req.body.password);

    UserService.loginUser(req.body)
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
    ProjectService.list({
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
    UserService.modify({ email: req.body.email }, { password: passwordToHash(newPassword) })
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
    UserService.modify({ _id: req.user._id }, req.body)
        .then(updatedUser => {
            res.status(httpStatus.OK).send(updatedUser)
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: `An error occured during update process! Error: ${err}`
        }))
}

const deleteUser = (req, res) => {
    UserService.remove(req.params.id)
        .then(removedUser => {
            res.status(httpStatus.OK).send(removedUser);
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: `An error occured during delete process! Error: ${err}`
        }))
}

const updateProfileImage = (req, res) => {
    console.log(req.files)
    if (!req.files?.profile_image) {
        return res.status(httpStatus.BAD_REQUEST).send({
            error: "You have not any required information for this process!"
        })
    }
    const extension = path.extname(req.files.profile_image.name);
    const fileName = `${req.user._id}${extension}`
    const folderPath = path.join(__dirname, "../", "uploads/users", fileName);
    req.files.profile_image.mv(folderPath, function (err) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err });
        UserService.modify({ _id: req.user._id }, { profile_photo: fileName })
            .then(updatedUser => {
                return res.status(httpStatus.OK).send(updatedUser);
            })
            .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err }));
    })
}
module.exports = {
    create,
    index,
    login,
    projectList,
    resetPassword,
    update,
    deleteUser,
    updateProfileImage
}