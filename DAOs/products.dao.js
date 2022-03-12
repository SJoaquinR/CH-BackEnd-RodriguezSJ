const ContainerMongoDB = require("../containers/mongoProducts.js");

class ProductsDAO extends ContainerMongoDB {
  constructor() {
    super("products", {
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
      },
    });
  }
}

module.exports = ProductsDAO;
/*
    Testing
*/
// const objPrd = new ProductosDAO();
// console.log(await objPrd.listarAll());
