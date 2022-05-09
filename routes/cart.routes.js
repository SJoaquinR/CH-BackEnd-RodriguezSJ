/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const logger = require("../containers/logger.js");
const routerCart = express.Router();

const ContainerFileCarts = require("../containers/fileCart.js");
const ContainerFileProducts = require("../containers/fileProducts.js");

const globalUserApi = require("../apis/globalUserApi.js");
/* -------------------------------- Instancia de Express ------------------------ */
const cartApi = new ContainerFileCarts();
const productsApi = new ContainerFileProducts();

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
routerCart.get("/:id/productos", (req, res) => {
  try {
    const datosUsuario = {
      name: globalUserApi.get(),
    };

    const { id } = req.params;

    if (id) {
      const cart = cartApi.list(id);
      //res.status(200).json(cart);
      res.render("partials/bodyCart", { datos: datosUsuario, carts: cart });
    } else {
      const cart = cartApi.listAll();
      //res.status(200).json(carts);
      res.render("partials/bodyCart", { datos: datosUsuario, carts: cart });
    }
  } catch (error) {
    res.status(404).json({ msg: `Error al obtener Productos: ${error}` });
  }
});

//Crea un carrito y devuelve su id
routerCart.post("/", (req, res) => {
  try {
    //const products = productsApi.listAll();

    let cart = {
      timestamp: Date.now(),
      products: [],
    };

    const response = cartApi.create(cart);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: `Error al crear un carrito: ${error}` });
  }

  //res.redirect("/");
});

//Para incorporar productos al carrito por su id de producto
routerCart.post("/:idProd/productos/", (req, res) => {
  try {
    const { idProd } = req.params;
    const idCart = 1;

    if (!idProd) {
      res.status(400).json({ msg: "Debe ingresar un id del producto" });
    } else {
      const product = productsApi.list(idProd).data;
      let cart = cartApi.list(idCart);

      cart = {
        id: idCart,
        timestamp: cart.timestamp,
        products: [...cart.products, product],
      };

      const response = cartApi.save(cart, idCart);
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
routerCart.delete("/:idCart/productos/:idProd", (req, res) => {
  try {
    const { idCart, idProd } = req.params;

    if (!idCart || !idProd) {
      res
        .status(400)
        .json({ msg: "Debe ingresar un id del carrito y un id del producto" });
    } else {
      const response = cartApi.delete(idCart, idProd);
      res.status(200).json(response);
    }
  } catch (error) {
    res
      .status(404)
      .json({ msg: `Error al eliminar un producto del carrito: ${error}` });
  }
});

//vacia un carrito y lo eliminar
routerCart.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ msg: "Debe ingresar un id del carrito" });
    } else {
      const response = cartApi.deleteCart(id);
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
