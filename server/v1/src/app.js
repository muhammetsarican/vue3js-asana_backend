const express = require("express");
const helmet = require("helmet");
const config = require("./config");
const { ProjectRoutes, UserRoutes, SectionRoutes, TaskRoutes } = require("./routes");
const loaders = require("./loaders");
const events = require("./scripts/events");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");

config();
loaders();
events();

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "./", "uploads")));
app.use(express.json());
app.use(helmet());
app.use(fileUpload());

const PORT = process.env.APP_PORT;

app.get("/", (req, res, next) => {
    res.send({
        status: "true",
        message: "success"
    })
})
app.listen(PORT, () => {
    console.log(`Server running on ${PORT} port.`);
    app.use("/projects", ProjectRoutes.router);
    app.use("/users", UserRoutes.router)
    app.use("/sections", SectionRoutes.router)
    app.use("/tasks", TaskRoutes.router)

    app.use((req, res, next) => {
        console.log("An error occured!");
        const error = new Error("The page not found, which you searched!");
        error.status = 404;
        next(error);
    })

    app.use(errorHandler);
})