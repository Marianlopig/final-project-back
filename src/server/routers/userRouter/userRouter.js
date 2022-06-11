const express = require("express");
const {
  userLogin,
  userRegister,
  userAccount,
} = require("../../controllers/userControllers/userControllers");
const { auth } = require("../../middlewares/auth/auth");

const userRouter = express.Router();

userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);
userRouter.get("/account", auth, userAccount);

module.exports = userRouter;
