const mongoUsersApi = require("../apis/usersApi.js");
const globalUserApi = require("../apis/globalUserApi.js");
const UsersDTO = require("../classes/UsersDTO.class.js");

const logger = require("../utils/logger.js");

class ChatController {
  getChat = async (req, res) => {
    const datosUsuario = { name: await globalUserApi.get()};
    res.render("partials/bodyChat", { datos: datosUsuario });
  };

  errorChat = (req, res) => {
    let { url, method } = req;
    logger.warn("Ruta %s %s no implementada", url, method);
    res.send(`Ruta ${method} ${url} no está implementada`);
  };
}

module.exports = ChatController;