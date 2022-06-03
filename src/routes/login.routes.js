/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const session = require("express-session");
const logger = require('../containers/logger.js');
//const globalUserApi = require('../apis/globalUserApi.js');

const {login} = require('../controllers/login.controller.js');

const routerLogin = express.Router();

//const usersDAO = require("../DAOs/users.dao.js");
//const mongoUsersApi = require("../apis/usersApi.js");

/* -------------------------------- Instancia de Express ------------------------ */
//const mongoUsersApi = new usersDAO();
routerLogin.use(session({
  secret: '123456789!@#$%^&*()',
  resave: false,
  saveUninitialized: false
}));

/* -------------------------------- Rutas -------------------------------- */
// https://www.iconfinder.com/free_icons


//Ruta inicio
routerLogin.get("/", (req, res) => {
  res.render('pages/login');
});
 
//Login Usuarios
routerLogin.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    req.session.email = email;

    const datosUsuario = await login(email, password);

    if (datosUsuario) {
      res.render("partials/bodyNavbar", {datos: datosUsuario,});
    }else{
      logger.info('Usuario o contraseña invalida');
      res.render("pages/login-error");
    }
  } catch (error) {
    logger.warn(`Error al logear Usuario ${error}`)
    res.status(404).json({ msg: `Error al obtener Usuario: ${error}` });
  }
});
  //FIN login Usuario
  
  //LogOut Usuario
routerLogin.get("/logout", (req, res) => {
   const email = req.session?.email;

   if (email) {
    req.session.destroy(err=>{
      if (err) {
          res.json({err});
      } 
    });
  }
  res.redirect("/");
});
  //FIN LogOut Usuario

  routerLogin.get('*', (req, res) => {
    let { url, method } = req
    logger.warn('Ruta %s %s no implementada', url, method)
    res.send(`Ruta ${method} ${url} no está implementada`)
  })

module.exports = routerLogin;
