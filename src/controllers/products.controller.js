const globalUserApi = require("../apis/globalUserApi.js");
const ProductsDAO = require("../services/products.dao.js");
const ContainerAdmin = require("../containers/security.js");
const fileProductsApi = new ProductsDAO();
const roleAdminApi = new ContainerAdmin();

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

module.exports = { getProduct, addProduct, updateProduct, deleteProduct };
