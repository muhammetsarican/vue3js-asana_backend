const Projects = require("../models/Projects")

const insert = (projectData) => {
    const projects = new Projects(projectData);
    return projects.save();
}

module.exports = {
    insert
}