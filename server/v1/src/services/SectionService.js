const SectionModel = require("../models/Sections");
const BaseService = require("./BaseService");

class SectionService extends BaseService {
    constructor() {
        super(SectionModel);
    }

    list() {
        return super.list().populate([{
            path: "user_id",
            select: "full_name email profile_photo",
        }, {
            path: "project_id",
            select: "name",
        }])
    }
}

module.exports = new SectionService();