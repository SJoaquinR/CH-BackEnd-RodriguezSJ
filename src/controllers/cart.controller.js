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


class CartController {
  getCartProduct = async (req, res) => {
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
  }

  addCart = async (req, res) => {
    try {
      const response = await addCart();
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ msg: `Error al crear un carrito: ${error}` });
    }
  }

  addCartProduct = async (req, res) => {
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
  }

  deleteCartProduct = async (req, res) => {
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
  }

  deleteCart = async (req, res) => {
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
  }
}

module.exports = CartController;
