const fs = require("fs");
const CustomError = require("../classes/CustomError.class.js");
class ContainerFileCarts {
  filePath;
  listProducts;

  constructor() {
    this.filePath = "./src/containers/data/carts.data.txt";
  }

  list(id) {
    try {
      const carts = this.listAll();
      const cart = carts.find((cart) => cart.id == id);

      return (
        cart || {
          error: `carrito no encontrado`,
        }
      );
    } catch (error) {
      const cuserr = new CustomError(500, 'Error en list()', error);
      return { error: cuserr };
    }
  }

  listAll() {
    try {
      const carts = fs.readFileSync(this.filePath, "utf-8");

      if (carts) {
        this.listCarts = JSON.parse(carts);
      } else {
        this.listCarts = [];
      }
      return this.listCarts;
    } catch (error) {
      const cuserr = new CustomError(500, 'Error en listAll()', error);
      return { error: cuserr };
    }
  }

  save(cart, id) {
    try {
      const carts = this.listAll();
      const index = carts.findIndex((p) => p.id == id);

      if (index !== -1) {
        carts[index] = cart;
        fs.writeFileSync(this.filePath, JSON.stringify(carts, null, 2));
        return { msg: "Producto actualizado", data: carts };
      } else {
        return { error: `Carrito no encontrado para actualizar` };
      }
    } catch (error) {
      const cuserr = new CustomError(500, 'Error en save()', error);
      return { error: cuserr };
    }
  }

  create(cart) {
    try {
      let idCart = 0;
      const carts = this.listAll();

      if (carts.length !== 0) {
        idCart = carts.length + 1;
      } else {
        idCart = 1;
      }

      const newCart = { ...cart, id: idCart };
      carts.push(newCart);

      fs.writeFileSync(this.filePath, JSON.stringify(carts, null, 2));
      return { msg: "Carrito Creado", data: newCart };
    } catch (error) {
      return { error: `No se pudo crear el Carrito` };
    }
  }

  delete(idCart, idProduct) {
    try {
      const carts = this.listAll();
      const index = carts.findIndex((p) => p.id == idCart);

      if (index !== -1) {
        const cart = carts[index];
        const products = cart.products;
        const indexProduct = products.findIndex((p) => p.id == idProduct);

        if (indexProduct !== -1) {
          products.splice(indexProduct, 1);
          carts[index] = cart;
          fs.writeFileSync(this.filePath, JSON.stringify(carts, null, 2));
          return { msg: "Producto eliminado", data: carts };
        } else {
          return { error: `Producto no encontrado` };
        }
      } else {
        return { error: `Carrito no encontrado` };
      }
    } catch (error) {
      const cuserr = new CustomError(500, 'Error en delete()', error);
      return { error: cuserr };
    }
   
  }

  deleteCart(idCart) {
    try {
      const carts = this.listAll();
      const index = carts.findIndex((p) => p.id == idCart);

      if (index !== -1) {
        carts.splice(index, 1);
        fs.writeFileSync(this.filePath, JSON.stringify(carts, null, 2));
        return { msg: "Carrito eliminado", data: carts };
      } else {
        return { error: `Carrito no encontrado` };
      }
    } catch (error) {
      return { error: `No se pudo eliminar el carrito` };
    }
  }
}

module.exports = ContainerFileCarts;
