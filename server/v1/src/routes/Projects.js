const express = require("express");
const { create, index, update, deleteProject } = require("../controllers/Projects");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Projects");
const authenticateToken = require("../middlewares/authenticate");

const router = express.Router();

router.route("/").get(authenticateToken, index)
router.route("/").post(authenticateToken, validate(schemas.createValidation), create)
router.route("/:id").patch(authenticateToken, validate(schemas.updateValidation), update)
router.route("/:id").delete(authenticateToken, deleteProject)

module.exports = {
    router,
}