const fs = require("fs");
const path = require("path");

const saveImages = (req, res, next) => {
  const { files } = req;
  req.imagePaths = [];

  if (files) {
    files.forEach((file) => {
      const newFileName = `${Date.now()}-${file.originalname}`;
      fs.rename(
        path.join("images", file.filename),
        path.join("images", newFileName),
        (error) => {
          if (error) {
            next(error);
          }
        }
      );
      req.imagePaths.push(newFileName);
    });
  }
  next();
};

module.exports = { saveImages };
