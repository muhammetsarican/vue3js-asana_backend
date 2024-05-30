const express = require("express");
const TaskController = require("../controllers/TaskController");
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
router.route("/:section_id").get(IdChecker("section_id"), authenticateToken, TaskController.index())
router.route("/").post(authenticateToken, validate(schemas.createValidation), TaskController.create())
router.route("/:id").patch(authenticateToken, validate(schemas.updateValidation), TaskController.update())
router.route("/:id/make-comment").post(IdChecker(), authenticateToken, validate(schemas.commentValidation), TaskController.makeComment)
router.route("/:id/:commentId").delete(IdChecker(), authenticateToken, TaskController.deleteComment)
router.route("/:id/add-sub-task").post(IdChecker(), authenticateToken, validate(schemas.createValidation), TaskController.addSubTask)
router.route("/:id").delete(IdChecker(), authenticateToken, TaskController.delete())
router.route("/fetch-task/:id").get(IdChecker(), authenticateToken, TaskController.fetchTask)

module.exports = {
    router,
}