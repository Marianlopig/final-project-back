require("dotenv").config();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../database/models/User");
const customError = require("../../utils/customError");

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: `${username}` });

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
  const { name, username, password, city, email } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    const error = customError(409, "This user already exists...");

    next(error);
    return;
  }
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      username,
      password: encryptedPassword,
      city,
      email,
    };

    await User.create(newUser);

    res.status(201).json({ username });
  } catch (error) {
    const createdError = customError(400, "Wrong user data..", error.message);
    next(createdError);
  }
};

module.exports = {
  userRegister,
  userLogin,
};
