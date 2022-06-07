/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const routerProducts = express.Router();
const ProductsController = require("../controllers/products.controller.js");

/* -------------------------------- Rutas -------------------------------- */
// https://www.iconfinder.com/free_icons
class ProductsRouter {
  constructor() {
    this.controller = new ProductsController();
  }

  start() {
    routerProducts.get("/:id?", this.controller.getProduct);

    routerProducts.post("/", this.controller.addProduct);

    routerProducts.put("/:id", this.controller.updateProduct);

    routerProducts.delete("/:id", this.controller.deleteProduct);

    routerProducts.get("*", this.controller.errorProduct);

    return routerProducts;
  }
}

module.exports = ProductsRouter;
