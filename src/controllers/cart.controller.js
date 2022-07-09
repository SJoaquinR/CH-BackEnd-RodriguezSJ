const globalUserApi = require("../apis/globalUserApi.js");
const ContainerFileCarts = require("../containers/fileCart.js");
const ProductsDAO = require("../services/ProductsDAO.mongodb.js");
const UsersDAO = require("../services/UsersDAO.mongodb.js");
const fileProductsApi = new ProductsDAO();
const UsersDAOApi = new UsersDAO();
const cartApi = new ContainerFileCarts();

const ContainerSendMail = require("../containers/sendMail.js");
const sendMail = new ContainerSendMail();

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

async function addCart({ email }) {
  if (!email)
    return {
      error: "Debe ingresar el EMAIL del usuario que quiere crear el carrito",
    };

  const user = await UsersDAOApi.findUser(email);
  if (user.data === undefined) return { error: "Usuario no encontrado" };

  let cart = {
    user: {
      name: [user.data.name],
      email: [user.data.email],
      address: [user.data.address],
      phone: [user.data.phone],
    },
    timestamp: Date.now(),
    products: [],
  };
  console.log(cart);

  return await cartApi.create(cart);
}

async function addProductsCart(params) {
  const { idProd, idCart } = params;

  if (!idProd) {
    return { error: true, response: "Debe ingresar un id del producto" };
  } else {
    const product = await fileProductsApi.list(idProd);
    let cart = await cartApi.list(idCart);

    if (product.data === undefined)
      return { error: true, response: product.error };
    cart = {
      id: idCart,
      user: cart.user,
      timestamp: cart.timestamp,
      products: [...cart.products, product],
    };

    return { error: false, response: await cartApi.save(cart, idCart) };
  }
}

async function deleteProductCart(params) {
  const { idCart, idProd } = params;

  if (!idCart || !idProd) {
    return {
      error: true,
      response: "Debe ingresar un id del carrito y un id del producto",
    };
  } else {
    return { error: false, response: await cartApi.delete(idCart, idProd) };
  }
}

async function deleteCart(params) {
  const { id } = params;
  if (!id) {
    return { error: true, response: "Debe ingresar un id del carrito" };
  } else {
    return { error: false, response: await cartApi.deleteCart(id) };
  }
}

class CartController {
  getCartProduct = async (req, res) => {
    try {
      const response = await getCart(req.params);

      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ msg: `Error al obtener Productos: ${error}` });
    }
  };

  getCartOrder = async (req, res) => {
    try {
      const response = await getCart(req.params);

      const products = response.cart.products.map((product) => {
        return {
          name: product.data.name,
          price: product.data.price,
        };
      });

      const order = {
        productos: products,
        FechaHora: Date().toLocaleString(),
        NroOrden: response.cart.timestamp,
        email: response.cart.user.email[0],
        estado: "Generada",
      };
      
      globalUserApi.saveEmailSend(order.email);
      sendMail.enviarCorreo(`\n Nro de orden: ${order.NroOrden} \nFecha y hora: ${order.FechaHora} 
      \nEmail: ${order.email} \nProductos: ${JSON.stringify(order.productos, null, 2)} \nnEstado: ${order.estado}`
      , "Orden de productos comprados","Orden de productos comprados");

      res.status(200).json({ msg: `Nro Orden generada:  ${order.NroOrden}` });
    } catch (error) {
      res.status(404).json({ msg: `Error al obtener Productos: ${error}` });
    }
  };

  addCart = async (req, res) => {
    try {
      const response = await addCart(req.body);
      if (response.error) {
        res.status(404).json(response);
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      res.status(404).json({ msg: `Error al crear un carrito: ${error}` });
    }
  };

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
  };

  deleteCartProduct = async (req, res) => {
    try {
      const result = await deleteProductCart(req.params);
      const { error, response } = result;
      if (error) {
        res.status(400).json(response);
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      res
        .status(404)
        .json({ msg: `Error al eliminar un producto del carrito: ${error}` });
    }
  };

  deleteCart = async (req, res) => {
    try {
      const result = await deleteCart(req.params);
      const { error, response } = result;
      if (error) {
        res.status(400).json(response);
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      res.status(404).json({ msg: `Error al eliminar un carrito: ${error}` });
    }
  };
}

module.exports = CartController;
