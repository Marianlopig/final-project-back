require("dotenv").config();
const debug = require("debug")("gamersland:server:middlewares:errors");
const chalk = require("chalk");
const { ValidationError } = require("express-validation");
const customError = require("../../../utils/customError");

const notFoundError = (req, res, next) => {
  const error = customError(404, "Endpoint not found");

  next(error);
};

// eslint-disable-next-line no-unused-vars
const generalError = (error, req, res, next) => {
  debug(chalk.red(error.message || error.customMessage));
  let message = error.customMessage ?? "General error";
  const statusCode = error.statusCode ?? 500;

  if (error instanceof ValidationError) {
    message = "Wrong data";
    debug(chalk.red(JSON.stringify(error.details)));
  }
  res.status(statusCode).json({ error: true, message });
};

module.exports = {
  notFoundError,
  generalError,
};
