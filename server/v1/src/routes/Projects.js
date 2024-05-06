const express = require("express");
const { create, index } = require("../controllers/Projects");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Projects");
const authenticateToken = require("../middlewares/authenticate");

const router = express.Router();

router.route("/").get(authenticateToken, index)
router.route("/").post(authenticateToken, validate(schemas.createValidation), create)

module.exports = {
    router,
}