/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const logger = require('../containers/logger.js');
const ContainerSendMail = require('../containers/sendMail.js');
const routerRegister = express.Router();
const path = require("path");
const multert = require("multer");

//const usersDAO = require("../DAOs/users.dao.js");
const mongoUsersApi = require("../apis/usersApi.js");

/* -------------------------------- Middlewares -------------------------------- */
//Subir la ruta y el nombre del archivo
const storage = multert.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()} - ${file.originalname}`);
  },
});
//para ser uso de mi archivo
const upload = multert({ storage: storage });

/* -------------------------------- Instancia de Express ------------------------ */
//const mongoUsersApi = new usersDAO();
const sendMail = new ContainerSendMail();
/* -------------------------------- Rutas -------------------------------- */
// https://www.iconfinder.com/free_icons


routerRegister.get("/", (req, res) => {
  res.render("pages/register");
});

//obtener usuario
routerRegister.get("/user/:id?", async (req, res) => {
    //res.render("pages/register");
    try {
      const { id } = req.params;
  
      if (id) {
        const usuario = await mongoUsersApi.list(id);
        res.status(200).json(usuario);
      } else {
        const usuarios = await mongoUsersApi.listAll();
        res.status(200).json(usuarios);
      }
    } catch (error) {
      logger.warn('Error al obtener Usuario: %s', error);
      res.status(404).json({ msg: `Error al obtener Usuario: ${error}` });
    }
  });

//Agrega un usuario
routerRegister.post("/", upload.single("thumbnail"), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      const error = new Error("Archivo no encontrado");
      logger.warn(`Archivo no encontrado ${error}`);
      error.httpStatusCode = 400;
      return next(error);
    }

    const { name, address, email, password, age, phone} = req.body;

    let usuario = {
      timestamp: Date.now(),
      name: name,
      address: address,
      email: email,
      password: password,
      age: age,
      phone: phone,
      thumbnail: path.join(__dirname, "../uploads", file.filename),
    };

    const response = await mongoUsersApi.save(usuario);
    sendMail.enviarCorreo(`EMAIL: ${usuario.email} \n NOMBRE: ${usuario.name}`);
    //res.status(200).json(response);
    res.redirect("/login");
  } catch (error) {
    //res.status(404).json({ msg: `Error al agregar Usuario: ${error}` });
    logger.warn(`Error al agregar usuario ${error}`);
    res.render("pages/register-err");
  }
});

//recibe y actualiza un usuario según su id
routerRegister.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, email, password, age, phone, thumbnail} = req.body;

    let Usuario = {
      timestamp: Date.now(),
      name: name,
      address: address,
      email: email,
      password: password,
      age: age,
      phone: phone,
      thumbnail: thumbnail,
    };

    const response = await mongoUsersApi.update(Usuario, id);
    res.status(200).json(response);
  } catch (error) {
    logger.warn('Error al obtener Usuario: %s', error)
    res.status(404).json({ msg: `Error al actualizar Usuario: ${error}` });
  }
});

//elimina un usuario según su id
routerRegister.delete("/:id", async (req, res) => {
  try {
      const { id } = req.params;

      const response = await mongoUsersApi.delete(id);
      res.status(200).json(response);
  } catch (error) {
    logger.warn('Error al obtener Usuario: %s', error)
    res.status(404).json({ msg: `Error al eliminar Usuario: ${error}` });
  }
});

routerRegister.get('*', (req, res) => {
  let { url, method } = req
  logger.warn('Ruta %s %s no implementada', url, method)
  res.send(`Ruta ${method} ${url} no está implementada`)
})

module.exports = routerRegister;
