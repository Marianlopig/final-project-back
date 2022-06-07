const { Schema, model, SchemaTypes } = require("mongoose");

const ParkSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  photos: { type: [String], required: true },
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
  details: { type: [String] },
  address: {
    city: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  owner: { type: SchemaTypes.ObjectId, ref: "users" },
});
const Park = model("Park", ParkSchema, "parks");
module.exports = Park;
