const globalUserApi = require("../apis/globalUserApi.js");
const ContainerFileCarts = require("../containers/fileCart.js");
const ContainerFileProducts = require("../containers/fileProducts.js");
const cartApi = new ContainerFileCarts();
const productsApi = new ContainerFileProducts();

async function getCart(params) {
  const datosUsuario = {
    name: await globalUserApi.get(),
  };
  const { id } = params;

  if (id) {
    const cart = await cartApi.list(id);
    return { datosUsuario: datosUsuario, cart: cart };
  } else {
    const cart = await cartApi.listAll();
    return { datosUsuario: datosUsuario, cart: cart };
  }
}

async function addCart() {
    let cart = {
        timestamp: Date.now(),
        products: [],
      };
  
      return await cartApi.create(cart);
}

async function addProductsCart(params) {
    const { idProd } = params;
    const idCart = 1;

    if (!idProd) {
        return { error: true, response: "Debe ingresar un id del producto" };
    } else {
      const product = await productsApi.list(idProd).data;
      let cart = await cartApi.list(idCart);

      cart = {
        id: idCart,
        timestamp: cart.timestamp,
        products: [...cart.products, product],
      };

      return {error: false, response: await cartApi.save(cart, idCart)};
    }
}

async function deleteProductCart(params) {
    const { idCart, idProd } = params;

    if (!idCart || !idProd) {
        return { error: true, response: "Debe ingresar un id del carrito y un id del producto" };
    } else {
      return {error: false, response: await cartApi.delete(idCart, idProd)};
    }
}

async function deleteCart(params) {
    const { id } = params;
    if (!id) {
        return { error: true, response: "Debe ingresar un id del carrito" };
    } else {
        return {error: false, response: await cartApi.deleteCart(id)};
    }
}

module.exports = { getCart, addCart, addProductsCart, deleteProductCart, deleteCart };
