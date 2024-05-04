const express = require("express");
const { create, index } = require("../controllers/Projects");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Projects");

const router = express.Router();

router.get("/", index)
router.route("/").post(validate(schemas.createValidation), create)

module.exports = {
    router,
}