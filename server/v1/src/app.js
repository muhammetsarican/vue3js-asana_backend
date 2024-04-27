const express = require("express");
const helmet = require("helmet");
const config = require("./config");

config();

const app = express();
app.use(express.json());
app.use(helmet);

const PORT = process.env.APP_PORT;

app.get("/", (req, res, next) => {
    res.send({
        status: "true",
        message: "success"
    })
})
app.listen(PORT, () => {
    console.log(`Server running on ${PORT} port.`);
})