const path = require("path");
const logger = require("../containers/logger.js");
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

module.exports = { getUser, addUser, updateUser, deleteUser };
