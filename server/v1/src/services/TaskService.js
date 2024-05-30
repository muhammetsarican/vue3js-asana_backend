const TaskModel = require("../models/Tasks");
const BaseService = require("./BaseService");


class TaskService extends BaseService {
    constructor() {
        super(TaskModel);
    }

    findOne(where, expand) {
        if (!expand) return super.findOne(where);
        return super.findOne(where).populate([{
            path: "user_id",
            select: "full_name email profile_photo"
        }, {
            path: "comments",
            populate: {
                path: "user_id",
                select: "full_name email profile_photo"
            }
        }, {
            path: "sub_tasks",
            select: "title statuses sub_tasks"
        }])
    }

    list(where) {
        return super.list(where).populate([{
            path: "user_id",
            select: "full_name email profile_photo",
        }, {
            path: "project_id",
            select: "name",
        }, {
            path: "section_id",
            select: "name",
        }]);
    }
}

module.exports = new TaskService();