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
  favParks: [{ type: SchemaTypes.ObjectId, ref: "parks", default: [] }],
  ownParks: [{ type: SchemaTypes.ObjectId, ref: "parks", default: [] }],
});
const User = model("User", UserSchema, "users");
module.exports = User;
