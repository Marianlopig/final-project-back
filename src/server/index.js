const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { notFoundError, generalError } = require("./middlewares/errors/errors");
const userRouter = require("./routers/userRouter/userRouter");
const parkRouter = require("./routers/parkRouter.js/parkRouter");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("images"));

app.use("/users", userRouter);
app.use("/parks", parkRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
