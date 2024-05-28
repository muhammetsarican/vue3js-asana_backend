const express = require("express");
const { create, index, update, deleteTask, makeComment, deleteComment, addSubTask, fetchTask } = require("../controllers/Tasks");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Tasks");
const authenticateToken = require("../middlewares/authenticate");
const IdChecker = require("../middlewares/idChecker");

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send({
        message: "welcome to tasks"
    })
})
router.route("/:section_id").get(IdChecker("section_id"), authenticateToken, index)
router.route("/").post(authenticateToken, validate(schemas.createValidation), create)
router.route("/:id").patch(authenticateToken, validate(schemas.updateValidation), update)
router.route("/:id/make-comment").post(IdChecker(), authenticateToken, validate(schemas.commentValidation), makeComment)
router.route("/:id/:commentId").delete(IdChecker(), authenticateToken, deleteComment)
router.route("/:id/add-sub-task").post(IdChecker(), authenticateToken, validate(schemas.createValidation), addSubTask)
router.route("/:id").delete(IdChecker(), authenticateToken, deleteTask)
router.route("/fetch-task/:id").get(IdChecker(), authenticateToken, fetchTask)

module.exports = {
    router,
}