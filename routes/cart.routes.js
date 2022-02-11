/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const routerCart = express.Router();

const ContainerCart = require("../containers/cart.js");

/* -------------------------------- Instancia de Express ------------------------ */
const cartApi = new ContainerCart();

/* -------------------------------- Rutas -------------------------------- */
// https://www.iconfinder.com/free_icons

/* Estructura de cart:
id, timestamp(carrito), productos: { id, timestamp(producto), nombre, descripcion, código, foto (url), precio, stock }
*/

//devuelve un producto según su id
routerCart.get("/:id?", (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const product = cartApi.list(id);
      res.status(200).json(product);
    } else {
      const products = cartApi.listAll();
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(404).json({ msg: `Error al obtener Productos: ${error}` });
  }
});

//agrega un producto y usamos middlewares
routerCart.post("/", (req, res) => {
  try {
    const { title, price, image } = req.body;

    let producto = {
      title: title,
      price: price,
      image: image,
    };

    const response = cartApi.save(producto);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: `Error al agregar Producto: ${error}` });
  }

  //res.redirect("/");
});

//recibe y actualiza un producto según su id
routerCart.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, image } = req.body;

    let producto = {
      title: title,
      price: price,
      image: image,
    };

    const response = cartApi.update(producto, id);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: `Error al actualizar Producto: ${error}` });
  }
});

//elimina un producto según su id
routerCart.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;

    const response = cartApi.delete(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: `Error al eliminar Producto: ${error}` });
  }
});


module.exports = routerCart;
