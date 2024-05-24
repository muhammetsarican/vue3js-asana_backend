const joi = require("joi");

const createValidation = joi.object({
    title: joi.string().required().min(3),
    project_id: joi.string().required().min(8),
    section_id: joi.string().required().min(8),
    statuses: joi.array()
});

const updateValidation = joi.object({
    title: joi.string().min(3),
    project_id: joi.string().min(8),
    section_id: joi.string().min(8),
    statuses: joi.array()
})

const commentValidation = joi.object({
    comment: joi.string().min(8)
})
module.exports = {
    createValidation,
    updateValidation,
    commentValidation
}