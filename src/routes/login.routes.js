/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const session = require("express-session");
const LoginController = require("../controllers/login.controller.js");

const routerLogin = express.Router();
/* -------------------------------- Instancia de Express ------------------------ */
routerLogin.use(
  session({
    secret: "123456789!@#$%^&*()",
    resave: false,
    saveUninitialized: false,
  })
);

/* -------------------------------- Rutas -------------------------------- */
// https://www.iconfinder.com/free_icons

class LoginRouter {
  constructor() {
    this.controller = new LoginController();
  }

  start() {
    routerLogin.get("/", this.controller.initLogin);

    routerLogin.post("/", this.controller.startLogin);

    routerLogin.get("/logout", this.controller.logoutLogin);

    routerLogin.get("*", this.controller.errorLogin);

    return routerLogin;
  }
}

module.exports = LoginRouter;
