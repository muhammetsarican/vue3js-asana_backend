const express = require("express");
const ProjectController = require("../controllers/ProjectController");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Projects");
const authenticateToken = require("../middlewares/authenticate");
const IdChecker = require("../middlewares/idChecker");

const router = express.Router();

router.route("/").get(authenticateToken, ProjectController.index())
router.route("/").post(authenticateToken, validate(schemas.createValidation), ProjectController.create())
router.route("/:id").patch(IdChecker(), authenticateToken, validate(schemas.updateValidation), ProjectController.update())
router.route("/:id").delete(IdChecker(), authenticateToken, ProjectController.delete())

module.exports = {
    router,
}