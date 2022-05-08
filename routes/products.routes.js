/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const routerProducts = express.Router();

//import ProductsDAO from "../DAOs/products.dao.js";
//const ContainerFileProducts = require("../containers/fileProducts.js");
const ProductsDAO = require("../DAOs/products.dao.js");
const ContainerAdmin = require("../containers/security.js");

/* -------------------------------- Instancia de Express ------------------------ */
const fileProductsApi = new ProductsDAO();
const roleAdminApi = new ContainerAdmin();
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
routerProducts.get("/:id?", async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const product = await fileProductsApi.list(id);
      res.status(200).json(product);
    } else {
      const products = await fileProductsApi.listAll();
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(404).json({ msg: `Error al obtener Productos: ${error}` });
  }
});

//agrega un producto y usamos middlewares
routerProducts.post("/", async (req, res) => {
  try {
    if (!roleAdminApi.roleAdmin()) {
      res.status(401).json(roleAdminApi.notAutorized("POST", "/products"));
    } else {
      const { name, description, code, thumbnail, price, stock } = req.body;
 
      let producto = {
        timestamp: Date.now(),
        name: name,
        description: description,
        code: code,
        thumbnail: thumbnail,
        price: price,
        stock: stock,
      };

      const response = await fileProductsApi.save(producto);
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(404).json({ msg: `Error al agregar Producto: ${error}` });
  }

  //res.redirect("/");
});

//recibe y actualiza un producto según su id
routerProducts.put("/:id", async (req, res) => {
  try {
    if (!roleAdminApi.roleAdmin()) {
      res.status(401).json(roleAdminApi.notAutorized("PUT", "/products"));
    } else {
      const { id } = req.params;
      const { name, description, code, thumbnail, price, stock } = req.body;

      let producto = {
        timestamp: Date.now(),
        name: name,
        description: description,
        code: code,
        thumbnail: thumbnail,
        price: price,
        stock: stock,
      };

      const response = await fileProductsApi.update(producto, id);
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(404).json({ msg: `Error al actualizar Producto: ${error}` });
  }
});

//elimina un producto según su id
routerProducts.delete("/:id", async (req, res) => {
  try {
    if (!roleAdminApi.roleAdmin()) {
      res.status(401).json(roleAdminApi.notAutorized("DELETE", "/products"));
    } else {
      const { id } = req.params;

      const response = await fileProductsApi.delete(id);
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(404).json({ msg: `Error al eliminar Producto: ${error}` });
  }
});

routerProducts.get('*', (req, res) => {
  let { url, method } = req
  logger.warn('Ruta %s %s no implementada', url, method)
  res.send(`Ruta ${method} ${url} no está implementada`)
})

module.exports = routerProducts;
