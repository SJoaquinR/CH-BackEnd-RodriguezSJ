/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const routerProducts = express.Router();

const ContainerProducts = require("../containers/products.js");

/* -------------------------------- Instancia de Express ------------------------ */
const productsApi = new ContainerProducts();

/* -------------------------------- Rutas -------------------------------- */
// https://www.iconfinder.com/free_icons
/*
Estructura productos:
id, timestamp, nombre, descripcion, código, foto (url), precio, stock.
El timestamp puede implementarse con Date.now()
*/

// routerProducts.get("/", (req, res) => {
//    console.log(products);
// res.render('pages/products.ejs', {products: products});
// });

//devuelve un producto según su id
routerProducts.get("/:id?", (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const product = productsApi.list(id);
      res.status(200).json(product);
    } else {
      const products = productsApi.listAll();
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(404).json({ msg: `Error al obtener Productos: ${error}` });
  }
});

//agrega un producto y usamos middlewares
routerProducts.post("/", (req, res) => {
  try {
    const { name, description, code, thumbnail, price, stock } = req.body;

    let producto = {
      timestamp: Date.now(),
      name: name,
      description: description,
      code: code,
      thumbnail: thumbnail,
      price: price,
      stock: stock
    };

    const response = productsApi.save(producto);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: `Error al agregar Producto: ${error}` });
  }

  //res.redirect("/");
});

//recibe y actualiza un producto según su id
routerProducts.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, code, thumbnail, price, stock } = req.body;

    let producto = {
      timestamp: Date.now(),
      name: name,
      description: description,
      code: code,
      thumbnail: thumbnail,
      price: price,
      stock: stock
    };

    const response = productsApi.update(producto, id);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: `Error al actualizar Producto: ${error}` });
  }
});

//elimina un producto según su id
routerProducts.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;

    const response = productsApi.delete(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: `Error al eliminar Producto: ${error}` });
  }
});


module.exports = routerProducts;
