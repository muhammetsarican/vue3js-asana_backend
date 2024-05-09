const mongoose = require("mongoose");
const logger = require("../scripts/logger/Projects");

const ProjectSchema = new mongoose.Schema({
    name: String,
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true,
    versionKey: false
})

/* ProjectSchema.pre("save", (next, doc) => {
    console.log(doc);
    next();
});
 */
ProjectSchema.post("save", (doc, next) => {
    console.log("after", doc);
    logger.log({
        level: 'info',
        message: doc
    })
    next();
});

module.exports = mongoose.model("project", ProjectSchema);