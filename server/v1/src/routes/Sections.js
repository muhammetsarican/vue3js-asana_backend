const express = require("express");
const SectionController = require("../controllers/SectionController");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Sections");
const authenticateToken = require("../middlewares/authenticate");
const IdChecker = require("../middlewares/idChecker");

const router = express.Router();

router.route("/:project_id").get(IdChecker("project_id"), authenticateToken, SectionController.index())
router.route("/").post(authenticateToken, validate(schemas.createValidation), SectionController.create())
router.route("/:id").patch(IdChecker(), authenticateToken, validate(schemas.updateValidation), SectionController.update())
router.route("/:id").delete(IdChecker(), authenticateToken, SectionController.delete())

module.exports = {
    router,
}