const SectionService = require("../services/SectionService");
const BaseController = require("./BaseController");

class SectionController extends BaseController {
    constructor() {
        super(SectionService);
    }
    index() {
        return super.index("project_id")
    }
}

module.exports = new SectionController();