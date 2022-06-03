const usersDAO = require("../services/users.dao.js");
const mongoUsersApi = new usersDAO();

module.exports = mongoUsersApi;