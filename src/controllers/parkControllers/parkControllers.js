const debug = require("debug")("columpima:controllers:parkcontrollers");
const Park = require("../../database/models/Park");

const getParks = async (req, res, next) => {
  try {
    const parks = await Park.find();

    const parksRet = parks.map(
      ({ _id: id, name, description, photos, location, details, owner }) => ({
        id,
        name,
        description,
        photos,
        location,
        details,
        owner,
      })
    );

    const response = {
      page: 0,
      pageSize: 0,
      next: "",
      previous: "",
      results: parksRet,
    };

    res.status(200).json(response);
    debug("users collection request received");
  } catch (error) {
    error.statusCode = 404;
    error.customMessage = "Not found";
    next(error);
  }
};

module.exports = {
  getParks,
};
