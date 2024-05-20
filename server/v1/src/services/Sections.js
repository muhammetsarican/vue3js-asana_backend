const Sections = require("../models/Sections")

const insert = (data) => {
    return new Sections(data).save();
}

const list = (project_id) => {
    return Sections.find(project_id || {})
        .populate({
            path: "user_id",
            select: "full_name email profile_photo",
        })
        .populate({
            path: "project_id",
            select: "name",
        });
}

const modify = (data, id) => {
    return Sections.findByIdAndUpdate(id, data, { new: true });
}

const remove = (id) => {
    return Sections.findByIdAndDelete(id, { new: true });
}
module.exports = {
    insert,
    list,
    modify,
    remove
}