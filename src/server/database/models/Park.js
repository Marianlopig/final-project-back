const { Schema, model, SchemaTypes } = require("mongoose");

const LocationSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const ParkSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  photos: { type: [String], required: true },
  location: LocationSchema,
  details: { type: [String] },
  owner: { type: SchemaTypes.ObjectId, ref: "users" },
});
const Park = model("Park", ParkSchema, "parks");
module.exports = Park;
