const path = require("path");
const logger = require("../utils/logger.js");
const mongoUsersApi = require("../apis/usersApi.js");
const ContainerSendMail = require("../containers/sendMail.js");
const sendMail = new ContainerSendMail();

 
async function getUser(id) {
  try {
    if (id) {
      const usuario = await mongoUsersApi.list(id);
      return usuario;
    } else {
      const usuarios = await mongoUsersApi.listAll();
      return usuarios;
    }
  } catch (error) {
    logger.warn("Error al obtener Usuario: %s", error);
    return { msg: `Error al obtener Usuario: ${error}` };
  }
}

async function addUser(body, file) {
  try {
    const { name, address, email, password, age, phone } = body;

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

    return response;
    //res.status(200).json(response);
    // res.redirect("/login");
  } catch (error) {
    //res.status(404).json({ msg: `Error al agregar Usuario: ${error}` });
    logger.warn(`Error al agregar usuario ${error}`);
    return false;
    // res.render("pages/register-err");
  }
}

async function updateUser(body, id) {
    const { name, address, email, password, age, phone, thumbnail } = body;

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

    return await mongoUsersApi.update(Usuario, id);
}

async function deleteUser(id) {
    return await mongoUsersApi.delete(id);
}

class RegisterController {
  initRegister = (req, res) => {
    res.render("pages/register");
  }

  getUserRegister =  async (req, res) => {
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
  }

  addUserRegister = async (req, res, next) => {
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
  }

  updateUserRegister = async (req, res) => {
    try {
      const { id } = req.params;
      const response = await updateUser(req.body, id);
  
      res.status(200).json(response);
    } catch (error) {
      logger.warn("Error al obtener Usuario: %s", error);
      res.status(404).json({ msg: `Error al actualizar Usuario: ${error}` });
    }
  }

  deleteUserRegister = async (req, res) => {
    try {
      const { id } = req.params;
  
      const response = await deleteUser(id);
      res.status(200).json(response);
    } catch (error) {
      logger.warn("Error al obtener Usuario: %s", error);
      res.status(404).json({ msg: `Error al eliminar Usuario: ${error}` });
    }
  }

  errorRegister = (req, res) => {
    let { url, method } = req;
    logger.warn("Ruta %s %s no implementada", url, method);
    res.send(`Ruta ${method} ${url} no está implementada`);
  }
}

module.exports = RegisterController;
