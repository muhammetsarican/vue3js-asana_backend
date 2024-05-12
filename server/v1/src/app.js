const express = require("express");
const helmet = require("helmet");
const config = require("./config");
const { ProjectRoutes, UserRoutes } = require("./routes");
const loaders = require("./loaders");
const events = require("./scripts/events");

config();
loaders();
events();

const app = express();
app.use(express.json());
app.use(helmet());

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
})