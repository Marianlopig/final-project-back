require("dotenv").config();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../database/models/User");
const customError = require("../../utils/customError");

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    const error = customError(403, "Bad request", "User or password incorrect");
    next(error);
    return;
  }
  const userData = {
    username: user.username,
    name: user.name,
  };

  const rightPassword = await bcrypt.compare(password, user.password);
  if (!rightPassword) {
    const error = customError(403, "Bad request", "User or password incorrect");

    next(error);
    return;
  }
  const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);

  res.status(200).json({ token });
};

const userRegister = async (req, res, next) => {
  const { name, username, password } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    const error = new Error();
    error.statusCode = 409;
    error.message = "This user already exists...";

    next(error);
    return;
  }
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, username, password: encryptedPassword };

    await User.create(newUser);

    res.status(201).json({ username });
  } catch (error) {
    error.statusCode = 400;
    error.message = "Wrong user data..";
    next(error);
  }
};

module.exports = {
  userRegister,
  userLogin,
};
