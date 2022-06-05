const fs = require("fs");
const CustomError = require("../classes/CustomError.class.js");

class ContainerFileProducts {
  filePath;
  listProducts;

  constructor() {
    this.filePath = "./src/containers/data/products.data.txt";
  }

  list(id) {
    try {
      const products = this.listAll();
      const product = products.find((product) => product.id == id);

      return (
        { msg: `Listado del producto con id: ${id}`, data: product } || {
          error: `Producto no encontrado`,
        }
      );
    } catch (error) {
      const cuserr = new CustomError(500, 'Error en list()', error);
      return { error: cuserr };
    }
  }

  listAll() {
    try {
      const products = fs.readFileSync(this.filePath, 'utf-8');

      if (products) {
        this.listProducts = JSON.parse(products);
      } else {
        this.listProducts = [];
      }
      return this.listProducts;
    } catch (error) {
      const cuserr = new CustomError(500, 'Error en listAll()', error);
      return { error: cuserr };
    }
  }

  save(product) {
    try {
      let idProduct = 0;
      const products = this.listAll();

      if (products.length !== 0) {
        idProduct = products.length + 1;
      } else {
        idProduct = 1;
      }

      const newProduct = { ...product, id: idProduct };
      products.push(newProduct);

      fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
      return { msg: "Producto Agregado", data: newProduct };
    } catch (error) {
      const cuserr = new CustomError(500, 'Error en save()', error);
      return { error: cuserr };
    }
  }

  update(product, id) {
    try {
      const products = this.listAll();
      const index = products.findIndex((p) => p.id == id);

      if (index !== -1) {
        products[index] = product;
        fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
        return { msg: "Producto actualizado", data: product };
      } else {
        return { error: `Producto no encontrado para actualizar` };
      }
    } catch (error) {
      const cuserr = new CustomError(500, 'Error en update()', error);
      return { error: cuserr };
    }
  }

  delete(id) {
    try {
      const products = this.listAll();
      const index = products.findIndex((p) => p.id == id);

      if (index !== -1) {
        products.splice(index, 1);
        fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
        return { msg: "Producto eliminado", data: products };
      } else {
        return { error: `Producto no encontrado para eliminar` };
      }
    } catch (error) {
      const cuserr = new CustomError(500, 'Error en delete()', error);
      return { error: cuserr };
    }
  }
}

module.exports = ContainerFileProducts;
