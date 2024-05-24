const mongoose = require("mongoose");
const logger = require("../scripts/logger/Tasks");

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    assigned_to: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    due_date: Date,
    statuses: [String],
    section_id: {
        type: mongoose.Types.ObjectId,
        ref: "section"
    },
    project_id: {
        type: mongoose.Types.ObjectId,
        ref: "project"
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    order: Number,
    isCompleted: Boolean,
    comments: [
        {
            comment: String,
            commented_at: Date,
            user_id: {
                type: mongoose.Types.ObjectId,
                ref: "user"
            },
        }
    ],
    media: [String],
    sub_tasks: [{
        type: mongoose.Types.ObjectId,
        ref: "task"
    }]
}, {
    timestamps: true,
    versionKey: false
})

/* TaskSchema.pre("save", (next, doc) => {
    console.log(doc);
    next();
});
 */
TaskSchema.post("save", (doc, next) => {
    console.log("after", doc);
    logger.log({
        level: 'info',
        message: doc
    })
    next();
});

module.exports = mongoose.model("task", TaskSchema);