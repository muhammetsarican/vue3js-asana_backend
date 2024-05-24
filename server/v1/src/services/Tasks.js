const Task = require("../models/Tasks")

const findOne = (where, expand) => {
    if (!expand) return Task.findOne(where);
    return Task.findOne(where)
        .populate({
            path: "user_id",
            select: "full_name email profile_photo"
        })
        .populate({
            path: "comments",
            populate: {
                path: "user_id",
                select: "full_name email profile_photo"
            }
        })
        .populate({
            path: "sub_tasks",
            select: "title statuses sub_tasks"
        })
}
const insert = (data) => {
    return new Task(data).save();
}

const list = (project_id) => {
    return Task.find(project_id || {})
        .populate({
            path: "user_id",
            select: "full_name email profile_photo",
        })
        .populate({
            path: "project_id",
            select: "name",
        })
        .populate({
            path: "section_id",
            select: "name",
        });
}

const modify = (data, id) => {
    return Task.findByIdAndUpdate(id, data, { new: true });
}

const remove = (id) => {
    return Task.findByIdAndDelete(id, { new: true });
}
module.exports = {
    insert,
    list,
    modify,
    remove,
    findOne
}