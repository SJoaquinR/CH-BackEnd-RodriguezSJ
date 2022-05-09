const usersDAO = require("../DAOs/users.dao.js");
const mongoUsersApi = new usersDAO();

module.exports = mongoUsersApi;