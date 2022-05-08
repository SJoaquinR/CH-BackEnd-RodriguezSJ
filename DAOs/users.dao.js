const ContainerUsersMongoDB = require("../containers/mongoUsers.js");

class UsersDAO extends ContainerUsersMongoDB {
  constructor() {
    super("usuarios", {
      timestamp: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: false,
        default: 0,
      },
      phone: {
        type: Number,
        required: false,
        default: 0,
      },
      thumbnail: {
        type: String,
        required: false,
      },
    });
  }
}

module.exports = UsersDAO;
/*
    Testing
*/
// const obj = new UsersDAO();
// console.log(await obj.listAll());
