const ProjectService = require("../services/ProjectService");
const BaseController = require("./BaseController");

class ProjectController extends BaseController {
    constructor() {
        super(ProjectService);
    }
}

module.exports = new ProjectController();