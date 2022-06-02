const express = require("express");
const {
  getParks,
} = require("../../controllers/parkControllers/parkControllers");

const parkRouter = express.Router();

parkRouter.get("/list", getParks);

module.exports = parkRouter;
