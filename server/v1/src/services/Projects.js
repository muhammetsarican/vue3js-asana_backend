const Projects = require("../models/Projects")

const insert = (projectData) => {
    const projects = new Projects(projectData);
    return projects.save();
}

const list = () => {
    return Projects.find({}).populate({
        path: "user_id",
        select: "full_name email profile_photo",
    });
}

const modify = (data, id) => {
    return Projects.findByIdAndUpdate(id, data, { new: true });
}

const remove = (id) => {
    return Projects.findByIdAndDelete(id, { new: true });
}
module.exports = {
    insert,
    list,
    modify,
    remove
}