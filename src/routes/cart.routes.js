/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const routerCart = express.Router();
const CartController = require("../controllers/cart.controller.js");

/* -------------------------------- Rutas -------------------------------- */
// https://www.iconfinder.com/free_icons
class CartRouter {
  constructor() {
    this.controller = new CartController();
  }

  start() {
    routerCart.get("/:id/productos", this.controller.getCartProduct);

    routerCart.post("/", this.controller.addCart);

    routerCart.post("/:idProd/productos/", this.controller.addCartProduct);

    routerCart.delete("/:idCart/productos/:idProd", this.controller.deleteCartProduct);

    routerCart.delete("/:id", this.controller.deleteCart);

    return routerCart;
  }
}

module.exports = CartRouter;
