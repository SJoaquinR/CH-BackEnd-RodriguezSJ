/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const routerCart = express.Router();
 
const ContainerFileCarts = require("../containers/fileCart.js");
const ContainerFileProducts = require("../containers/fileProducts.js");

/* -------------------------------- Instancia de Express ------------------------ */
const cartApi = new ContainerFileCarts();
const productsApi = new ContainerFileProducts();

/* -------------------------------- Rutas -------------------------------- */
// https://www.iconfinder.com/free_icons

/* Estructura de cart:
id, timestamp(carrito), productos: { id, timestamp(producto), nombre, descripcion, código, foto (url), precio, stock }
*/

//Me permite listar todos los productos guardados en el carrito
routerCart.get("/:id/productos", (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const cart = cartApi.list(id);
      res.status(200).json(cart);
    } else {
      const carts = cartApi.listAll();
      res.status(200).json(carts);
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
routerCart.post("/:id/productos", (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ msg: "Debe ingresar un id del producto" });
    } else {
      const product = productsApi.list(id).data;
      let cart = cartApi.list(1);

      cart = {
        id: 1,
        timestamp: cart.timestamp,
        products: [...cart.products,product],
      };

      const response = cartApi.save(cart, 1);
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

module.exports = routerCart;
