const express = require("express");
const {
  getParks,
  deletePark,
} = require("../../controllers/parkControllers/parkControllers");

const parkRouter = express.Router();

parkRouter.get("/list", getParks);
parkRouter.delete("/:id", deletePark);

module.exports = parkRouter;
