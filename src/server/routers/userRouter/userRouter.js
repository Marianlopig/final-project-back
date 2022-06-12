const express = require("express");
const {
  userLogin,
  userRegister,
  userAccount,
  userAddFavourite,
  userDeleteFavourite,
} = require("../../controllers/userControllers/userControllers");
const { auth } = require("../../middlewares/auth/auth");

const userRouter = express.Router();

userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);
userRouter.get("/account", auth, userAccount);
userRouter.put("/addfavourite", auth, userAddFavourite);
userRouter.put("/deletefavourite", auth, userDeleteFavourite);

module.exports = userRouter;
