const express = require("express");
const multer = require("multer");
const {
  getParks,
  deletePark,
  createPark,
  getPark,
} = require("../../controllers/parkControllers/parkControllers");
const { auth } = require("../../middlewares/auth/auth");
const firebaseImageStore = require("../../middlewares/firebaseImage/firebaseImage");
const { saveImages } = require("../../middlewares/saveImages/saveImages");

const upload = multer({
  dest: "images/",
  limits: {
    fileSize: 10000000,
  },
});

const parkRouter = express.Router();

parkRouter.get("/list", getParks);
parkRouter.delete("/:id", auth, deletePark);
parkRouter.post(
  "/",
  auth,
  upload.array("image", 10),
  saveImages,
  firebaseImageStore,
  createPark
);
parkRouter.get("/:id", getPark);

module.exports = parkRouter;
