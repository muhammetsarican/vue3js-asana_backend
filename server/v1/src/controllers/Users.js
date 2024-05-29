const { passwordToHash, generateAccessToken, generateRefreshToken } = require("../scripts/utils/helper");
const UserService = require("../services/UserService");
const httpStatus = require("http-status");
const ProjectService = require("../services/ProjectService");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");
const ApiError = require("../errors/apiError");

const index = (req, res) => {
    UserService.list()
        .then(response => {
            return res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)))
};

const create = (req, res) => {
    req.body.password = passwordToHash(req.body.password);

    UserService.insert(req.body)
        .then(response => {
            return res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)))
};

const login = (req, res, next) => {
    req.body.password = passwordToHash(req.body.password);

    UserService.loginUser(req.body)
        .then(user => {
            if (!user) return next(new ApiError("No user exist with this email!", httpStatus.NOT_FOUND));

            user = {
                ...user.toObject(),
                tokens: {
                    access_token: generateAccessToken(user),
                    refresh_token: generateRefreshToken(user)
                }
            }
            delete user.password;
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                success: true,
                message: user
            });
        })
        .catch(err => next(new ApiError(err?.message)));
}

const projectList = (req, res) => {
    ProjectService.list({
        user_id: req.user._id
    })
        .then(response => {
            return res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)))
}

const resetPassword = (req, res) => {
    const newPassword = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
    UserService.modify({ email: req.body.email }, { password: passwordToHash(newPassword) })
        .then(updatedUser => {
            if (!updatedUser) return next(new ApiError("No user was found like that!", httpStatus.NOT_FOUND));

            eventEmitter.emit("send_email", {
                to: updatedUser.email,
                subject: "Reset Password",
                html: `At your request, your reset password operation done. <br/> After login, dont forget change your password. <br/> New password: ${newPassword}`
            });

            res.status(httpStatus.OK).send({
                success: true,
                message: "The neccessary information was sended your email for resetting password."
            })
        })
        .catch((err) => next(new ApiError(err?.message)));
}

const update = (req, res) => {
    UserService.modify({ _id: req.user._id }, req.body)
        .then(response => {
            return res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)))
}

const deleteUser = (req, res) => {
    UserService.remove(req.params.id)
        .then(response => {
            return res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)))
}

const updateProfileImage = (req, res) => {
    console.log(req.files)
    if (!req.files?.profile_image) return next(new ApiError("You have not any required information for this process!", httpStatus.BAD_REQUEST));

    const extension = path.extname(req.files.profile_image.name);
    const fileName = `${req.user._id}${extension}`
    const folderPath = path.join(__dirname, "../", "uploads/users", fileName);

    req.files.profile_image.mv(folderPath, function (err) {
        if (err) return next(new ApiError(err?.message));

        UserService.modify({ _id: req.user._id }, { profile_photo: fileName })
            .then(updatedUser => {
                return res.status(httpStatus.OK).send({
                    success: true,
                    message: updatedUser
                })
            })
            .catch(err => next(new ApiError(err?.message)));
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