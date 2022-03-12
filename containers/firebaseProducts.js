const admin = require("firebase-admin");
const config = require("../utils/config.js");
const URL = config.firebase.rutaCert;

async function start() {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(URL),
    });
  } catch (error) {
  } finally {
    console.log("base Firebase conectada!");
  }
}
start();

class ContenedorFirebase {
  db = admin.firestore();

  constructor(nombreColeccion, esquema) {
    this.coleccion = db.collection(nombreColeccion, esquema);
  }

  async list(id) {
    try {
      const product = this.coleccion.doc(`${id}`);

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
      const snapshot = await this.coleccion.get();
      let docs = snapshot.docs;

      const response = docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
      }));
      console.log(response);
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
      console.log("save");
      // let doc = usuarios.doc(`${id}`); // id manual
      let doc = this.coleccion.doc(); //id automatico
      let docInsert = await doc.create(product);
      console.log(docInsert);

      return { msg: "Producto Agregado", data: doc };
    } catch (error) {
      return { error: `Producto no encontrado al intentar guardar` };
    }
  }

  async update(product, id) {
    try {
      const products = await this.listAll();
      const doc = this.coleccion.doc(`${id}`);

      if (doc !== -1) {
        const item = await doc.update(product);

        return { msg: "Producto actualizado", data: item };
      } else {
        return { error: `Producto no encontrado para actualizar` };
      }
    } catch (error) {
      return { error: `Producto no encontrado al intentar actualizar` };
    }
  }

  async delete(id) {
    try {
      const products = this.coleccion.doc(`${id}`);

      if (products !== -1) {
        const item = await products.delete();

        //fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
        return { msg: "Producto eliminado", data: item };
      } else {
        return { error: `Producto no encontrado para eliminar` };
      }
    } catch (error) {
      return { error: `Producto no encontrado al intentar eliminar` };
    }
  }
}

module.exports = ContenedorFirebase;
