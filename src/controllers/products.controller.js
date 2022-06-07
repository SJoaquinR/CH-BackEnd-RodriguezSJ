const globalUserApi = require("../apis/globalUserApi.js");
const ProductsDAO = require("../services/ProductsDAO.mongodb.js");
const ContainerAdmin = require("../containers/security.js");
const fileProductsApi = new ProductsDAO();
const roleAdminApi = new ContainerAdmin();
const logger = require("../utils/logger.js");
 
async function getProduct(id) {
  try {
    const datosUsuario = {
      name: await globalUserApi.get(), //Aca me faltaria armar el await
    };
    const product = await fileProductsApi.listAll();
    if (id) {
      product = await fileProductsApi.list(id);
      //   res.render("partials/bodyProducts", {
      //     datos: datosUsuario,
      //     products: product,
      //   });
    }

    return { datosUsuario: datosUsuario, product: product };
  } catch (error) {
    res.status(404).json({ msg: `Error al obtener Productos: ${error}` });
  }
}

async function addProduct(body) {
  if (!roleAdminApi.roleAdmin()) {
    return {
      roleAdmin: true,
      response: roleAdminApi.notAutorized("POST", "/products"),
    };
  } else {
    const { name, description, code, thumbnail, price, stock } = body;

    let producto = {
      timestamp: Date.now(),
      name: name,
      description: description,
      code: code,
      thumbnail: thumbnail,
      price: price,
      stock: stock,
    };
    return { roleAdmin: false, result: await fileProductsApi.save(producto) };
  }
}

async function updateProduct(body, params) {
  if (!roleAdminApi.roleAdmin()) {
    return {
      roleAdmin: true,
      response: roleAdminApi.notAutorized("PUT", "/products"),
    };
  } else {
    const { id } = params;
    const { name, description, code, thumbnail, price, stock } = body;

    let producto = {
      timestamp: Date.now(),
      name: name,
      description: description,
      code: code,
      thumbnail: thumbnail,
      price: price,
      stock: stock,
    };

    return {
      roleAdmin: false,
      result: await fileProductsApi.update(producto, id),
    };
  }
}

async function deleteProduct(params) {
  if (!roleAdminApi.roleAdmin()) {
    return {
      roleAdmin: true,
      response: roleAdminApi.notAutorized("DELETE", "/products"),
    };
  } else {
    const { id } = params;
    return { roleAdmin: false, result: await fileProductsApi.delete(id) };
  }
}

class ProductsController {
  getProduct = async (req, res) => {
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
  }

  addProduct = async (req, res) => {
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
  }

  updateProduct = async (req, res) => {
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
  }

  deleteProduct = async (req, res) => {
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
  }

  errorProduct = (req, res) => {
    let { url, method } = req;
    logger.warn("Ruta %s %s no implementada", url, method);
    res.send(`Ruta ${method} ${url} no está implementada`);
  }
}

module.exports = ProductsController;
