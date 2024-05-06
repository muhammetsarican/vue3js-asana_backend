const Projects = require("../models/Projects")

const insert = (projectData) => {
    const projects = new Projects(projectData);
    return projects.save();
}

const list = () => {
    return Projects.find({});
}

module.exports = {
    insert,
    list
}