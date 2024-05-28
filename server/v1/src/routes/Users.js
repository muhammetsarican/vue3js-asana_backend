const validate = require("../middlewares/validate");
const schemas = require("../validations/Users");
const express = require("express");
const { create, index, login, projectList, resetPassword, update, deleteUser, updateProfileImage } = require("../controllers/Users");
const authenticateToken = require("../middlewares/authenticate");
const IdChecker = require("../middlewares/idChecker");

const router = express.Router();

router.get("/", index);
router.route("/").post(validate(schemas.createValidation), create);
router.route("/").patch(authenticateToken, validate(schemas.updateValidation), update);
router.route("/login").post(validate(schemas.loginValidation), login);
router.route("/projects").get(authenticateToken, projectList);
router.route("/reset-password").get(validate(schemas.resetPasswordValidation), resetPassword);
router.route("/:id").delete(IdChecker(), authenticateToken, deleteUser);
router.route("/update-profile-image").post(authenticateToken, updateProfileImage)

module.exports = {
    router
};