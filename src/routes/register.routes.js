/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const logger = require("../utils/logger.js");
//const ContainerSendMail = require("../containers/sendMail.js");
const routerRegister = express.Router();
//const path = require("path");
const multert = require("multer");

//const usersDAO = require("../DAOs/users.dao.js");
const { getUser, addUser, updateUser, deleteUser } = require("../controllers/register.controller.js");

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
//const sendMail = new ContainerSendMail();
/* -------------------------------- Rutas -------------------------------- */
// https://www.iconfinder.com/free_icons

routerRegister.get("/", (req, res) => {
  res.render("pages/register");
});

//obtener usuario
routerRegister.get("/user/:id?", async (req, res) => {
  //res.render("pages/register");
  const { id } = req.params;
  const usuario = await getUser(id);

  if ([usuario.error != ""]) {
    res.status(200).json(usuario);
  } else {
    res
      .status(404)
      .json({ [usuario.msg]: `Error al obtener Usuario: ${[usuario.error]}` });
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

    const response = await addUser(req.body, file);
    if (response) {
      res.redirect("/login");
    }else{
      res.render("pages/register-err");
    }
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
    const response = await updateUser(req.body, id);

    res.status(200).json(response);
  } catch (error) {
    logger.warn("Error al obtener Usuario: %s", error);
    res.status(404).json({ msg: `Error al actualizar Usuario: ${error}` });
  }
});

//elimina un usuario según su id
routerRegister.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await deleteUser(id);
    res.status(200).json(response);
  } catch (error) {
    logger.warn("Error al obtener Usuario: %s", error);
    res.status(404).json({ msg: `Error al eliminar Usuario: ${error}` });
  }
});

routerRegister.get("*", (req, res) => {
  let { url, method } = req;
  logger.warn("Ruta %s %s no implementada", url, method);
  res.send(`Ruta ${method} ${url} no está implementada`);
});

module.exports = routerRegister;
