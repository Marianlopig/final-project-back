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

const AddressSchema = new Schema({
  city: {
    type: String,
  },
  cp: {
    type: String,
  },
  address: {
    type: String,
  },
});

const ParkSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  photos: { type: [String], required: true },
  location: LocationSchema,
  details: { type: [String] },
  address: AddressSchema,
  owner: { type: SchemaTypes.ObjectId, ref: "users" },
});
const Park = model("Park", ParkSchema, "parks");
module.exports = Park;
