//const ContainerFirebase = require("../containers/firebaseProducts.js");
const mongoose = require("mongoose");

const ProductFirebaseSchema = mongoose.Schema({
  timestamp: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: false,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  }
});

const ProductFirebaseModel = mongoose.model('productos', ProductFirebaseSchema);

module.exports = ProductFirebaseModel;