const jwt = require("jsonwebtoken");
const customError = require("../../../utils/customError");

const auth = (req, res, next) => {
  const authorization = req.headers?.authorization;

  const token = authorization?.replace("Bearer ", "");
  if (token === null || token === "") {
    next(customError(401, "Auth required"));
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (e) {
    next(customError(401, "Invalid token"));
  }
};
module.exports = { auth };
