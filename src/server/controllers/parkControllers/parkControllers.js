/* eslint-disable no-underscore-dangle */
const debug = require("debug")("columpima:controllers:parkcontrollers");
const customError = require("../../../utils/customError");
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
    const domainUrl = process.env.DOMAIN_URL;

    let nextPage = `${domainUrl}?page=${page + 1}&pageSize=${pageSize}`;
    if (page >= Math.trunc(total / pageSize)) {
      nextPage = undefined;
    }

    let prevPage;
    if (page > 0) {
      prevPage = `${domainUrl}?page=${page - 1}&pageSize=${pageSize}`;
    }

    const response = {
      page,
      pageSize,
      next: nextPage,
      previous: prevPage,
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

const deletePark = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const deletedPark = await Park.findOneAndDelete({ _id: id, owner: userId });
    if (deletedPark) {
      res.status(200).json({ msg: "Park deleted" });
    } else {
      const error = customError(404, "Unable to delete park");
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const createPark = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const park = req.body;
    const createdPark = await Park.create({ ...park, owner: userId });
    createdPark.id = createdPark._id;
    delete createdPark._id;
    delete createdPark.__v;

    res.status(201).json(createdPark);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getParks,
  deletePark,
  createPark,
};
