//const mongoose = require("mongoose");
//const config = require("../utils/config.js");
const CustomError = require("../classes/CustomError.class.js");
const MongoDBClient = require("../classes/MongoDBClient.class.js");
const logger = require("../utils/logger.js");

const productModel = require("../model/products.model.js");
const DAO = require("../classes/DAO.class.js");

// const URL = config.mongodb.url;

// async function start() {
//   await mongoose.connect(URL);
// }
// start();
//await mongoose.connect(URL);

class ContenedorMongoDB extends DAO {
  constructor() {
    super();
    this.coleccion = productModel;
    this.conn = new MongoDBClient();
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
      const cuserr = new CustomError(500, "Error en list()", error);
      return { error: cuserr };
    }
  }

  async listAll() {
    try {
      await this.conn.connect();
      const docs = await this.coleccion.find({});
      return docs;
    } catch (error) {
      const cuserr = new CustomError(500, "Error en listAll()", error);
      return { error: cuserr };
    } finally {
      this.conn.disconnect();
      logger.info(`Elemento listadoAll`);
    }
  }

  async save(product) {
    try {
      let idProduct = 0;
      const products = await this.listAll();

      await this.conn.connect();
      if (products.length !== 0) {
        idProduct = products.length + 1;
      } else {
        idProduct = 1;
      }

      const newProduct = { ...product, id: idProduct };
      const doc = await this.coleccion.create(newProduct);

      return { msg: "Producto Agregado", data: doc };
    } catch (error) {
      const cuserr = new CustomError(500, "Error en save()", error);
      return { error: cuserr };
    } finally {
      this.conn.disconnect();
      logger.info(`Elemento guardado ${product}`);
    }
  }

  async update(product, id) {
    try {
      const products = await this.listAll();
      const index = products.findIndex((p) => p.id == id);

      await this.conn.connect();
      if (index !== -1) {
        products[index] = product;

        let doc = await this.coleccion.updateOne({ id: id }, product);

        return { msg: "Producto actualizado", data: doc };
      } else {
        return { error: `Producto no encontrado para actualizar` };
      }
    } catch (error) {
      const cuserr = new CustomError(500, "Error en update()", error);
      return { error: cuserr };
    } finally {
      this.conn.disconnect();
      logger.info(`Elemento actualizado ${product}`);
    }
  }

  async delete(id) {
    try {
      const products = await this.listAll();
      const index = products.findIndex((p) => p.id == id);

      await this.conn.connect();
      if (index !== -1) {
        products.splice(index, 1);

        let doc = await this.coleccion.deleteOne({ id: id });

        //fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
        return { msg: "Producto eliminado", data: products };
      } else {
        return { error: `Producto no encontrado para eliminar` };
      }
    } catch (error) {
      const cuserr = new CustomError(500, "Error en delete()", error);
      return { error: cuserr };
    } finally {
      this.conn.disconnect();
      logger.info(`Elemento eliminado ${id}`);
    }
  }
}

module.exports = ContenedorMongoDB;
