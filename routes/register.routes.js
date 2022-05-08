/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const logger = require('../containers/logger.js');
const routerRegister = express.Router();

const usersDAO = require("../DAOs/users.dao.js");

/* -------------------------------- Instancia de Express ------------------------ */
const mongoUsersApi = new usersDAO();
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
      res.status(404).json({ msg: `Error al obtener Usuario: ${error}` });
    }
  });

//Agrega un usuario
routerRegister.post("/", async (req, res) => {
  try {
    const { name, address, email, password, age, phone, thumbnail} = req.body;

    let usuario = {
      timestamp: Date.now(),
      name: name,
      address: address,
      email: email,
      password: password,
      age: age,
      phone: phone,
      thumbnail: thumbnail,
    };

    const response = await mongoUsersApi.save(usuario);
    //res.status(200).json(response);
    res.redirect("/login");
  } catch (error) {
    //res.status(404).json({ msg: `Error al agregar Usuario: ${error}` });
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
    res.status(404).json({ msg: `Error al eliminar Usuario: ${error}` });
  }
});

routerRegister.get('*', (req, res) => {
  let { url, method } = req
  logger.warn('Ruta %s %s no implementada', url, method)
  res.send(`Ruta ${method} ${url} no está implementada`)
})

module.exports = routerRegister;
