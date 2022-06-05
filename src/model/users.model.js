const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  timestamp: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
    default: 0,
  },
  phone: {
    type: Number,
    required: false,
    default: 0,
  },
  thumbnail: {
    type: String,
    required: false,
  },
});

const UserModel = mongoose.model("usuarios", UserSchema);

module.exports = UserModel;
