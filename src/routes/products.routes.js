/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const routerProducts = express.Router();

//import ProductsDAO from "../DAOs/products.dao.js";
//const ContainerFileProducts = require("../containers/fileProducts.js");
//const ProductsDAO = require("../DAOs/products.dao.js");
//const ContainerAdmin = require("../containers/security.js");

//const globalUserApi = require("../apis/globalUserApi.js");
const {
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller.js");

/* -------------------------------- Instancia de Express ------------------------ */
//const fileProductsApi = new ProductsDAO();
//const roleAdminApi = new ContainerAdmin();
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
    const response = await getProduct(id);

    const { datosUsuario, product } = response;
    res.render("partials/bodyProducts", {
      datos: datosUsuario,
      products: product,
    });
  } catch (error) {
    res.status(404).json({ msg: `Error al obtener Productos: ${error}` });
  }
});

//agrega un producto y usamos middlewares
routerProducts.post("/", async (req, res) => {
  try {
    const response = await addProduct(req.body);
    const { roleAdmin, result } = response;
    if (roleAdmin) {
      res.status(401).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(404).json({ msg: `Error al agregar Producto: ${error}` });
  }

  //res.redirect("/");
});

// //recibe y actualiza un producto según su id
routerProducts.put("/:id", async (req, res) => {
  try {
    const response = await updateProduct(req.body, req.params);
    const { roleAdmin, result } = response;
    if (roleAdmin) {
      res.status(401).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(404).json({ msg: `Error al actualizar Producto: ${error}` });
  }
});

// //elimina un producto según su id
routerProducts.delete("/:id", async (req, res) => {
  try {
    const response = await deleteProduct(req.params);
    const { roleAdmin, result } = response;
    if (roleAdmin) {
      res.status(401).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(404).json({ msg: `Error al eliminar Producto: ${error}` });
  }
});

routerProducts.get("*", (req, res) => {
  let { url, method } = req;
  logger.warn("Ruta %s %s no implementada", url, method);
  res.send(`Ruta ${method} ${url} no está implementada`);
});

module.exports = routerProducts;
