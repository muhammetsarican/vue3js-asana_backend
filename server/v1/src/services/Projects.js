const Projects = require("../models/Projects")
const list = () => {
    return Projects.find({});
}
const insert = (projectData) => {
    const projects = new Projects(projectData);
    return projects.save();
}

module.exports = {
    insert,
    list
}