const TaskService = require("../services/TaskService");
const httpStatus = require("http-status");

const index = (req, res) => {
    if (!req?.params?.section_id) return res.status(httpStatus.BAD_REQUEST).send({
        error: "Project id is required, please provide it!"
    })
    TaskService.list({ section_id: req.params.section_id })
        .then(response => {
            res.status(httpStatus.OK).send(response);
        })
        .catch(err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        })
}

const create = (req, res) => {
    req.body.user_id = req.user;
    TaskService.insert(req.body)
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
    TaskService.modify(req.body, req.params.id)
        .then(response => {
            res.status(httpStatus.OK).send(response);
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: "An error occured during save operation."
        }))
}

const deleteTask = (req, res) => {
    if (!req.params.id) return res.status(httpStatus.BAD_REQUEST).send({
        message: "Id information not found!"
    })
    TaskService.remove(req.params.id)
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

const makeComment = (req, res) => {
    TaskService.findOne({ _id: req.params.id })
        .then(mainTask => {
            if (!mainTask) return res.status(httpStatus.NOT_FOUND).send({
                message: "No record found like that!"
            })
            const comment = {
                ...req.body,
                commented_at: new Date(),
                user_id: req.user
            };
            mainTask.comments.push(comment);
            mainTask.save()
                .then(updatedDoc => {
                    res.status(httpStatus.OK).send({
                        status: "success",
                        data: updatedDoc
                    })
                })
                .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    success: false,
                    error: err
                }))
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err }));
}

const deleteComment = (req, res) => {
    TaskService.findOne({ _id: req.params.id })
        .then(mainTask => {
            mainTask.comments = mainTask.comments.filter(comment => comment._id?.toString() !== req.params.commentId);
            mainTask.save()
                .then(updatedDoc => {
                    res.status(httpStatus.OK).send({
                        success: true,
                        data: updatedDoc
                    })
                })
                .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err }));
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err }));
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
                        .then(updatedDoc => {
                            //! New document sends to user
                            return res.status(httpStatus.OK).send({
                                success: true,
                                data: updatedDoc
                            })
                        })
                        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err }));
                })
                .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err))
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err }));
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