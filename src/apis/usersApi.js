const usersDAO = require("../services/UsersDAO.mongodb.js");
const mongoUsersApi = new usersDAO();

module.exports = mongoUsersApi;