const express = require("express");
const { create, index, update, deleteSection } = require("../controllers/Sections");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Sections");
const authenticateToken = require("../middlewares/authenticate");

const router = express.Router();

router.route("/:project_id").get(authenticateToken, index)
router.route("/").post(authenticateToken, validate(schemas.createValidation), create)
router.route("/:id").patch(authenticateToken, validate(schemas.updateValidation), update)
router.route("/:id").delete(authenticateToken, deleteSection)

module.exports = {
    router,
}