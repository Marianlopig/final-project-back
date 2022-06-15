/* eslint-disable no-underscore-dangle */
const debug = require("debug")("columpia:controllers:parkcontrollers");

const customError = require("../../../utils/customError");
const Park = require("../../database/models/Park");

const getParks = async (req, res, next) => {
  try {
    const page = +(req.query?.page || 0);
    let pageSize = +(req.query?.pageSize || 10);
    if (pageSize > 50) {
      pageSize = 50;
    }

    let queryNextPrev = "";
    const filter = {};
    if (req.query?.owner) {
      filter.owner = req.query.owner;
      queryNextPrev += `owner=${req.query.owner}`;
    }
    if (req.query?.city) {
      filter["address.city"] = {
        $regex: `^${req.query.city}$`,
        $options: "i",
      };
      queryNextPrev += `city=${req.query.city}`;
    }
    if (req.query?.ids) {
      filter._id = { $in: req.query.ids.split(",") };
      queryNextPrev += `ids=${req.query.ids}`;
    }

    const parks = await Park.find(filter)
      .sort({ _id: -1 })
      .limit(pageSize)
      .skip(page * pageSize);

    const total = await Park.count(filter);

    const parksRet = parks.map(
      ({
        _id: id,
        name,
        description,
        photos,
        photosBackup,
        location,
        details,
        owner,
        address,
      }) => ({
        id,
        name,
        description,
        photos,
        photosBackup,
        location,
        details,
        owner,
        address,
      })
    );
    const domainUrl = process.env.DOMAIN_URL;

    let nextPage = `${domainUrl}/parks/list?page=${
      page + 1
    }&pageSize=${pageSize}&${queryNextPrev}`;
    if (page >= Math.trunc(total / pageSize)) {
      nextPage = undefined;
    }

    let prevPage;
    if (page > 0) {
      prevPage = `${domainUrl}/parks/list?page=${
        page - 1
      }&pageSize=${pageSize}&${queryNextPrev}`;
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
  } catch (error) {
    next(customError(404, "Not found"));
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
      next(customError(404, "Unable to delete park"));
    }
  } catch (error) {
    next(error);
  }
};

const createPark = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const park = req.body;
    park.photos = req.imagePaths;
    park.photosBackup = req.imageBackupPath;
    const createdPark = await Park.create({ ...park, owner: userId });
    createdPark.id = createdPark._id;
    delete createdPark._id;
    delete createdPark.__v;

    res.status(201).json(createdPark);
  } catch (error) {
    next(error);
  }
};

const getPark = async (req, res, next) => {
  const { id } = req.params;

  try {
    const foundPark = await Park.findOne({ _id: id }).lean();
    if (foundPark) {
      const { _id, __v, ...park } = foundPark;
      res.status(200).json({ ...park, id: _id });
    } else {
      next(customError(404, "Unable to find the park"));
    }
  } catch (error) {
    next(error);
  }
};

const editPark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const park = req.body;
    if (req.imagePaths && req.imagePaths[0]) {
      park.photos = req.imagePaths;
      park.photosBackup = req.imageBackupPath;
    }

    const update = { ...park, owner: userId };

    const { _id, __v, ...updatedPark } = await Park.findOneAndUpdate(
      { _id: id, owner: userId },
      update,
      { returnOriginal: false }
    ).lean();

    res.status(200).json({ ...updatedPark, id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getParks,
  deletePark,
  createPark,
  getPark,
  editPark,
};
