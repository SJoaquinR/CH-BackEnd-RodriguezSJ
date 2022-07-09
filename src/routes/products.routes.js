/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const routerProducts = express.Router();
const ProductsController = require("../controllers/products.controller.js");
const jwt = require("../utils/jwt.js");

/* -------------------------------- Rutas -------------------------------- */
// https://www.iconfinder.com/free_icons
class ProductsRouter {
  constructor() {
    this.controller = new ProductsController();
  }

  start() {
    routerProducts.get("/:id?", jwt.auth, this.controller.getProduct);

    routerProducts.post("/", jwt.auth, this.controller.addProduct);

    routerProducts.put("/:id", jwt.auth, this.controller.updateProduct);

    routerProducts.delete("/:id", jwt.auth, this.controller.deleteProduct);

    routerProducts.get("*", this.controller.errorProduct);

    return routerProducts;
  }
}

module.exports = ProductsRouter;
