const Projects = require("../models/Projects")

const insert = (projectData) => {
    const projects = new Projects(projectData);
    return projects.save();
}

const list = () => {
    return Projects.find({}).populate({
        path: "user_id",
        select: "full_name email",
    });
}

const modify = (data, id) => {
    return Projects.findByIdAndUpdate(id, data, { new: true });
}

module.exports = {
    insert,
    list,
    modify
}