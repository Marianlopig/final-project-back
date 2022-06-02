const { Schema, model, SchemaTypes } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  favParks: [{ type: SchemaTypes.ObjectId, ref: "parks" }],
  ownParks: [{ type: SchemaTypes.ObjectId, ref: "parks" }],
});
const User = model("User", UserSchema, "users");
module.exports = User;
