const mongoUsersApi = require("../apis/usersApi.js");
const globalUserApi = require("../apis/globalUserApi.js");
const UsersDTO = require("../classes/UsersDTO.class.js");

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

module.exports = { login };
