const ProjectModel = require("../models/Projects");
const BaseService = require("./BaseService");

class ProjectService extends BaseService {
    constructor() {
        super(ProjectModel);
    }

    list(where) {
        return super.list(where).populate({
            path: "user_id",
            select: "full_name email profile_photo",
        })
    }
}

module.exports = new ProjectService();