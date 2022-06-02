const { Schema, model } = require("mongoose");

const LocationSchema = new Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

const ParkSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  photos: { type: [String], required: true },
  location: { LocationSchema, required: true },
  characteristics: { type: [String] },
  owner: { type: [String], required: true },
});
const Park = model("Park", ParkSchema, "parks");
module.exports = Park;
