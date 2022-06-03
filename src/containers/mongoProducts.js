const mongoose = require("mongoose");
const config = require("../utils/config.js");

const URL = config.mongodb.url;

async function start() {
  await mongoose.connect(URL);
}
start();
//await mongoose.connect(URL);

class ContenedorMongoDB {
  constructor(nombreColeccion, esquema) {
    this.coleccion = mongoose.model(nombreColeccion, esquema);
  }

  async list(id) {
    try {
      const products = await this.listAll();
      const product = products.find((product) => product.id == id);

      return (
        { msg: `Listado del producto con id: ${id}`, data: product } || {
          error: `Producto no encontrado`,
        }
      );
    } catch (error) {
      return { error: `Producto no encontrado` };
    }
  }

  async listAll() {
    try {
      const docs = await this.coleccion.find({});
      return docs;
    } catch (error) {
      //this.console.log(error);
      return {
        code: "001",
        msg: "Error al consumir ListarAll()",
      };
    }
  }

  async save(product) {
    try {
      let idProduct = 0;
      const products = await this.listAll();

      if (products.length !== 0) {
        idProduct = products.length + 1;
      } else {
        idProduct = 1;
      }

      const newProduct = { ...product, id: idProduct };
      const doc = await this.coleccion.create(newProduct);

      return { msg: "Producto Agregado", data: doc };
    } catch (error) {
      return { error: `Producto no encontrado al intentar guardar` };
    }
  }

  async update(product, id) {
    try {
      const products = await this.listAll();
      const index = products.findIndex((p) => p.id == id);

      if (index !== -1) {
        products[index] = product;

        let doc = await this.coleccion.updateOne({ id: id }, product);

        return { msg: "Producto actualizado", data: doc };
      } else {
        return { error: `Producto no encontrado para actualizar` };
      }
    } catch (error) {
      return { error: `Producto no encontrado al intentar actualizar` };
    }
  }

  async delete(id) {
    try {
      const products = await this.listAll();
      const index = products.findIndex((p) => p.id == id);

      if (index !== -1) {
        products.splice(index, 1);

        let doc = await this.coleccion.deleteOne({ id: id });

        //fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
        return { msg: "Producto eliminado", data: products };
      } else {
        return { error: `Producto no encontrado para eliminar` };
      }
    } catch (error) {
      return { error: `Producto no encontrado al intentar eliminar` };
    }
  }
}

module.exports = ContenedorMongoDB;
