const express = require("express");
const {
  getParks,
  deletePark,
} = require("../../controllers/parkControllers/parkControllers");
const { auth } = require("../../middlewares/auth/auth");

const parkRouter = express.Router();

parkRouter.get("/list", getParks);
parkRouter.delete("/:id", auth, deletePark);

module.exports = parkRouter;
