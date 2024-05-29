const ApiError = require("../errors/apiError");
const TaskService = require("../services/TaskService");
const httpStatus = require("http-status");

const index = (req, res) => {
    TaskService.list({ section_id: req.params.section_id })
        .then(response => {
            return res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)))
}

const create = (req, res) => {
    req.body.user_id = req.user;
    TaskService.insert(req.body)
        .then(response => {
            return res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)))
}

const update = (req, res) => {
    TaskService.modify(req.body, req.params.id)
        .then(response => {
            return res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)))
}

const deleteTask = (req, res) => {
    TaskService.remove(req.params.id)
        .then(response => {
            return res.status(httpStatus.OK).send({
                success: true,
                message: response
            });
        })
        .catch(err => next(new ApiError(err?.message)))
}

const makeComment = (req, res) => {
    TaskService.findOne({ _id: req.params.id })
        .then(mainTask => {
            if (!mainTask) return next(new ApiError("No record found like that!", httpStatus.NOT_FOUND));

            const comment = {
                ...req.body,
                commented_at: new Date(),
                user_id: req.user
            };
            mainTask.comments.push(comment);
            mainTask.save()
                .then(response => {
                    return res.status(httpStatus.OK).send({
                        success: true,
                        message: response
                    });
                })
                .catch(err => next(new ApiError(err?.message)))
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err }));
}

const deleteComment = (req, res) => {
    TaskService.findOne({ _id: req.params.id })
        .then(mainTask => {
            mainTask.comments = mainTask.comments.filter(comment => comment._id?.toString() !== req.params.commentId);
            mainTask.save()
                .then(response => {
                    return res.status(httpStatus.OK).send({
                        success: true,
                        message: response
                    });
                })
                .catch(err => next(new ApiError(err?.message)))
        })
        .catch(err => next(new ApiError(err.message)));
}

const addSubTask = (req, res) => {
    //! Get main tasks information
    TaskService.findOne({ _id: req.params.id })
        .then(mainTask => {
            //! Create sub task
            TaskService.insert({ ...req.body, user_id: req.user })
                .then(subTask => {
                    //! Sub tasks reference showns on main task and main task updates
                    mainTask.sub_tasks.push(subTask);
                    console.log(mainTask.sub_tasks);
                    mainTask.save()
                        //! New document sends to user
                        .then(response => {
                            return res.status(httpStatus.OK).send({
                                success: true,
                                message: response
                            });
                        })
                        .catch(err => next(new ApiError(err?.message)))
                })
                .catch(err => next(new ApiError(err.message)))
        })
        .catch(err => next(new ApiError(err.message)));
}

const fetchTask = (req, res) => {
    TaskService.findOne({ _id: req.params.id }, true)
        .then(mainTask => {
            res.status(httpStatus.OK).send({
                success: true,
                data: mainTask
            })
        })
}


module.exports = {
    create,
    index,
    update,
    deleteTask,
    makeComment,
    deleteComment,
    addSubTask,
    fetchTask
}