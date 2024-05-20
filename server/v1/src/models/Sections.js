const mongoose = require("mongoose");
const logger = require("../scripts/logger/Sections");

const SectionSchema = new mongoose.Schema({
    name: String,
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    project_id: {
        type: mongoose.Types.ObjectId,
        ref: "project"
    },
    order: Number,
}, {
    timestamps: true,
    versionKey: false
})

/* SectionSchema.pre("save", (next, doc) => {
    console.log(doc);
    next();
});
 */
SectionSchema.post("save", (doc, next) => {
    console.log("after", doc);
    logger.log({
        level: 'info',
        message: doc
    })
    next();
});

module.exports = mongoose.model("section", SectionSchema);