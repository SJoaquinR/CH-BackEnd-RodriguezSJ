const mongoose = require("mongoose");
const config = require("../utils/config.js");

const URL = config.mongodb.url;

async function start() {
  await mongoose.connect(URL);
}
start();
//await mongoose.connect(URL);

class ContenedorUsersMongoDB {
  constructor(nombreColeccion, esquema) {
    this.coleccion = mongoose.model(nombreColeccion, esquema);
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
      return { error: `Usuario no encontrado` };
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

  async login(email, password) {
    try {
      const items = await this.listAll();
      const item = items.find((item) => item.email == email && item.password == password);

      return (
        { msg: `Usuario: ${email}`, data: item }
      );
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
      const doc = await this.coleccion.create(newItem);

      return { msg: "Usuario Agregado", data: doc };
    } catch (error) {
      return { error: `Usuario no encontrado al intentar guardar` };
    }
  }

  async update(item, id) {
    try {
      const items = await this.listAll();
      const index = items.findIndex((p) => p.id == id);

      if (index !== -1) {
        items[index] = item;

        let doc = await this.coleccion.updateOne({ id: id }, item);

        return { msg: "Usuario actualizado", data: doc };
      } else {
        return { error: `Usuario no encontrado para actualizar` };
      }
    } catch (error) {
      return { error: `Usuario no encontrado al intentar actualizar` };
    }
  }

  async delete(id) {
    try {
      const items = await this.listAll();
      const index = items.findIndex((p) => p.id == id);

      if (index !== -1) {
        items.splice(index, 1);

        let doc = await this.coleccion.deleteOne({ id: id });

        //fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2));
        return { msg: "Usuario eliminado", data: items };
      } else {
        return { error: `Usuario no encontrado para eliminar` };
      }
    } catch (error) {
      return { error: `Usuario no encontrado al intentar eliminar` };
    }
  }
}

module.exports = ContenedorUsersMongoDB;
