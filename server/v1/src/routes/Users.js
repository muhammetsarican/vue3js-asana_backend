const validate = require("../middlewares/validate");
const schemas = require("../validations/Users");
const express = require("express");
const UserController = require("../controllers/UserController");
const authenticateToken = require("../middlewares/authenticate");
const IdChecker = require("../middlewares/idChecker");

const router = express.Router();

router.get("/", UserController.index());
router.route("/").post(validate(schemas.createValidation), UserController.create());
router.route("/").patch(authenticateToken, validate(schemas.updateValidation), UserController.update());
router.route("/login").post(validate(schemas.loginValidation), UserController.login);
router.route("/projects").get(authenticateToken, UserController.projectList);
router.route("/reset-password").get(validate(schemas.resetPasswordValidation), UserController.resetPassword);
router.route("/:id").delete(IdChecker(), authenticateToken, UserController.delete());
router.route("/update-profile-image").post(authenticateToken, UserController.updateProfileImage)

module.exports = {
    router
};