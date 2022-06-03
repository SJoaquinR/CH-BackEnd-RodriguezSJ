const ContainerFirebase = require("../containers/firebaseProducts.js");

class ProductsDAOFirebase extends ContainerFirebase {
  constructor() {
    super("productos", {
      timestamp: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: false,
      },
      thumbnail: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        default: 0,
      },
      stock: {
        type: Number,
        required: true,
        default: 0,
      },
    });
  }
}

module.exports = ProductsDAOFirebase;
/*
    Testing
*/


// async function start() {
//   try {
//     const listaUsuarios = [
//       {timestamp: Date.now(), name: 'nombreProducto1', description: 'descripcionProducto1', code: 'codigoProducto1', thumbnail: 'thumbnailProducto1', price: 2123, stock: 10},
//   ]

//     const objPrd = new ProductsDAOFirebase();
//     //console.log(await objPrd.listAll());
//     console.log(await objPrd.save(listaUsuarios));
//   } catch (error) {}
// }
// start();



