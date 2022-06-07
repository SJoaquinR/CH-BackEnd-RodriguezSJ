const mongoUsersApi = require("../apis/usersApi.js");
const globalUserApi = require("../apis/globalUserApi.js");
const UsersDTO = require("../classes/UsersDTO.class.js");
const logger = require("../utils/logger.js");

async function login(email, password) {
  if (email && password) {
    const usuario = await mongoUsersApi.login(email, password);
    const nameUser = globalUserApi.save(usuario.data.name);

    // const datosUsuario = {
    //   name: nameUser,
    //   email: email,
    // };

    return new UsersDTO(usuario.data.name, usuario.data.email);
  } else {
    return "";
  }
}

class LoginController {
  initLogin = (req, res) => {
    res.render("pages/login");
  };

  startLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      req.session.email = email;

      const datosUsuario = await login(email, password);

      if (datosUsuario) {
        res.render("partials/bodyNavbar", { datos: datosUsuario });
      } else {
        logger.info("Usuario o contraseña invalida");
        res.render("pages/login-error");
      }
    } catch (error) {
      logger.warn(`Error al logear Usuario ${error}`);
      res.status(404).json({ msg: `Error al obtener Usuario: ${error}` });
    }
  };

  logoutLogin = (req, res) => {
    const email = req.session?.email;

    if (email) {
      req.session.destroy((err) => {
        if (err) {
          res.json({ err });
        }
      });
    }
    res.redirect("/");
  };

  errorLogin = (req, res) => {
    let { url, method } = req;
    logger.warn("Ruta %s %s no implementada", url, method);
    res.send(`Ruta ${method} ${url} no está implementada`);
  };
}

module.exports = LoginController;