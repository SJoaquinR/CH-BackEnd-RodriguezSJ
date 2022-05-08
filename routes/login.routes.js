/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const session = require("express-session");
const logger = require('../containers/logger.js');
const routerLogin = express.Router();

const usersDAO = require("../DAOs/users.dao.js");

/* -------------------------------- Instancia de Express ------------------------ */
const mongoUsersApi = new usersDAO();
/* -------------------------------- Rutas -------------------------------- */
// https://www.iconfinder.com/free_icons


//Ruta inicio
routerLogin.get("/", (req, res) => {
  res.render('pages/login');
});
 
//Login Usuarios
routerLogin.post("/", async (req, res) => {
  try {
    const { nameUser, password } = req.body;

    if (nameUser && password) {
      const usuario = await mongoUsersApi.listUser(nameUser, password);
      
      req.session.nameUser = nameUser;
      req.session.password = password;
      //res.status(200).json(usuario);
      res.redirect("/index");
    } else {
      //res.status(401).json({ msg: `Usuario inexistente` });
      res.render("pages/login-error");
    }
  } catch (error) {
    res.status(404).json({ msg: `Error al obtener Usuario: ${error}` });
  }
});
  //FIN login Usuario
  
  //LogOut Usuario
routerLogin.get("/logout", (req, res) => {
  logger.info('Ruta logout GET');
  const nameUser = req.session?.nameUser;
  if (nameUser) {
    req.session.destroy((err) => {
      // if (!err) {
      //   res.render(path.join(process.cwd(), "/page/pages/chau.ejs"), {
      //     nameUser,
      //   });
      // } else {
        res.redirect("/");
      //}
    });
  } else {
    req.logout();
    res.redirect("/");
  }
});
  //FIN LogOut Usuario

  routerLogin.get('*', (req, res) => {
    let { url, method } = req
    logger.warn('Ruta %s %s no implementada', url, method)
    res.send(`Ruta ${method} ${url} no está implementada`)
  })

module.exports = routerLogin;
