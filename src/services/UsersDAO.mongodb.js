//const mongoose = require("mongoose");
//const config = require("../utils/config.js");
const CustomError = require("../classes/CustomError.class.js");
const MongoDBClient = require("../classes/MongoDBClient.class.js");
const logger = require("../utils/logger.js");

const userModel = require("../model/users.model.js");
const DAO = require("../classes/DAO.class.js");


// const URL = config.mongodb.url;

// async function start() {
//   await mongoose.connect(URL);
// }
// start();
//await mongoose.connect(URL);

class ContenedorUsersMongoDB extends DAO {
  constructor() {
    super();
    this.coleccion = userModel;
    this.conn = new MongoDBClient();
  }

  async list(id) {
    try {
      const items = await this.listAll();
      const item = items.find((item) => item.id == id);

      return (
        { msg: `Listado de Usuarios con id: ${id}`, data: item } || {
          error: `Usuario no encontrado`,
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

  async login(email, password) {
    try {
      const items = await this.listAll();
      const item = items.find(
        (item) => item.email == email && item.password == password
      );

      return { msg: `Usuario: ${email}`, data: item };
    } catch (error) {
      return { error: `Usuario no encontrado` };
    }
  }

  async save(item) {
    try {
      let idItem = 0;
      const items = await this.listAll();

      if (items.length !== 0) {
        idItem = items.length + 1;
      } else {
        idItem = 1;
      }

      const newItem = { ...item, id: idItem };

      await this.conn.connect();
      const doc = await this.coleccion.create(newItem);

      return { msg: "Usuario Agregado", data: doc };
    } catch (error) {
      const cuserr = new CustomError(500, "Error en save()", error);
      return { error: cuserr };
    } finally {
      this.conn.disconnect();
      logger.info(`Elemento guardado ${item}`);
    }
  }

  async update(item, id) {
    try {
      const items = await this.listAll();
      const index = items.findIndex((p) => p.id == id);

      await this.conn.connect();
      if (index !== -1) {
        items[index] = item;
        
        let doc = await this.coleccion.updateOne({ id: id }, item);

        return { msg: "Usuario actualizado", data: doc };
      } else {
        return { error: `Usuario no encontrado para actualizar` };
      }
    } catch (error) {
      const cuserr = new CustomError(500, "Error en update()", error);
      return { error: cuserr };
    } finally {
      this.conn.disconnect();
      logger.info(`Elemento actualizado ${item}`);
    }
  }

  async delete(id) {
    try {
      const items = await this.listAll();
      const index = items.findIndex((p) => p.id == id);

      await this.conn.connect();
      if (index !== -1) {
        items.splice(index, 1);

        let doc = await this.coleccion.deleteOne({ id: id });

        //fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2));
        return { msg: "Usuario eliminado", data: items };
      } else {
        return { error: `Usuario no encontrado para eliminar` };
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

module.exports = ContenedorUsersMongoDB;
