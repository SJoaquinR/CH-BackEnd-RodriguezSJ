/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const routerRegister = express.Router();
const multert = require("multer");
const RegisterController = require("../controllers/register.controller.js");

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

class RegisterRouter {
  constructor() {
    this.controller = new RegisterController();
  }

  start() {
    routerRegister.get("/", this.controller.initRegister);

    routerRegister.get("/user/:id?", this.controller.getUserRegister);

    routerRegister.post("/", upload.single("thumbnail"), this.controller.addUserRegister);

    routerRegister.put("/:id", this.controller.updateUserRegister);

    routerRegister.delete("/:id", this.controller.deleteUserRegister);

    routerRegister.get("*", this.controller.errorRegister);

    return routerRegister;
  }
}

module.exports = RegisterRouter;
