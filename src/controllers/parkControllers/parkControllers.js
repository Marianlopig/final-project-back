const debug = require("debug")("columpima:controllers:parkcontrollers");
const Park = require("../../database/models/Park");

const getParks = async (req, res, next) => {
  try {
    const page = +(req.query?.page || 0);
    let pageSize = +(req.query?.pageSize || 10);
    if (pageSize > 50) {
      pageSize = 50;
    }
    const parks = await Park.find()
      .limit(pageSize)
      .skip(page * pageSize);

    const total = await Park.count();

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
      page,
      pageSize,
      next: "",
      previous: "",
      total,
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
