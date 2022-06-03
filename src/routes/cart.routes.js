/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
//const logger = require("../containers/logger.js");
const routerCart = express.Router();

//const ContainerFileCarts = require("../containers/fileCart.js");
//const ContainerFileProducts = require("../containers/fileProducts.js");

//const globalUserApi = require("../apis/globalUserApi.js");
/* -------------------------------- Instancia de Express ------------------------ */
//const cartApi = new ContainerFileCarts();
//const productsApi = new ContainerFileProducts();

const {
  getCart,
  addCart,
  addProductsCart,
  deleteProductCart,
  deleteCart,
} = require("../controllers/cart.controller.js");

/* -------------------------------- Rutas -------------------------------- */
// https://www.iconfinder.com/free_icons

/* Estructura de cart:
id, timestamp(carrito), productos: { id, timestamp(producto), nombre, descripcion, código, foto (url), precio, stock }
*/

// routerCart.get("/", (req, res) => {

//   const datosUsuario = {
//     name: globalUserApi.get(),
//   };

//   res.render('partials/bodyCart', {datos: datosUsuario,});
// });

//Me permite listar todos los productos guardados en el carrito
routerCart.get("/:id/productos", async (req, res) => {
  try {
    const response = await getCart(req.params);

    const { datosUsuario, cart } = response;
    res.render("partials/bodyCart", {
      datos: datosUsuario,
      carts: cart,
    });
  } catch (error) {
    res.status(404).json({ msg: `Error al obtener Productos: ${error}` });
  }
});

//Crea un carrito y devuelve su id
routerCart.post("/", async (req, res) => {
  try {
    const response = await addCart();
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: `Error al crear un carrito: ${error}` });
  }

  //res.redirect("/");
});

//Para incorporar productos al carrito por su id de producto
routerCart.post("/:idProd/productos/", async (req, res) => {
  try {
    const result = await addProductsCart(req.params);
    const { error, response } = result;
    if (error) {
      res.status(400).json(response);
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    res
      .status(404)
      .json({ msg: `Error al agregar un producto al carrito: ${error}` });
  }

  //res.redirect("/");
});

//Eliminar un producto del carrito por su id de carrito y de producto
routerCart.delete("/:idCart/productos/:idProd", async (req, res) => {
  try {
    const result = await deleteProductCart(req.params);
    const { error, response } = result;
    if (error) {
      res.status(400).json(response);
    }else{
      res.status(200).json(response);
    }
  } catch (error) {
    res
      .status(404)
      .json({ msg: `Error al eliminar un producto del carrito: ${error}` });
  }
});

//vacia un carrito y lo eliminar
routerCart.delete("/:id", async (req, res) => {
  try {
    const result = await deleteCart(req.params);
    const { error, response } = result;
    if (error) {
      res.status(400).json(response);
    }else{
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(404).json({ msg: `Error al eliminar un carrito: ${error}` });
  }
});

// routerCart.get("*", (req, res) => {
//   let { url, method } = req;
//   logger.warn("Ruta %s %s no implementada", url, method);
//   res.send(`Ruta ${method} ${url} no está implementada`);
// });

module.exports = routerCart;
