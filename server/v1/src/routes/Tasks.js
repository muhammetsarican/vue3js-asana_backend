const express = require("express");
const { create, index, update, deleteTask, makeComment, deleteComment, addSubTask, fetchTask } = require("../controllers/Tasks");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Tasks");
const authenticateToken = require("../middlewares/authenticate");

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send({
        message: "welcome to tasks"
    })
})
router.route("/:section_id").get(authenticateToken, index)
router.route("/").post(authenticateToken, validate(schemas.createValidation), create)
router.route("/:id").patch(authenticateToken, validate(schemas.updateValidation), update)
router.route("/:id/make-comment").post(authenticateToken, validate(schemas.commentValidation), makeComment)
router.route("/:id/:commentId").delete(authenticateToken, deleteComment)
router.route("/:id/add-sub-task").post(authenticateToken, validate(schemas.createValidation), addSubTask)
router.route("/:id").delete(authenticateToken, deleteTask)
router.route("/fetch-task/:id").get(authenticateToken, fetchTask)

module.exports = {
    router,
}