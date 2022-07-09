/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const routerChats = express.Router();
const ChatController = require("../controllers/chat.controller.js");

/* -------------------------------- Rutas -------------------------------- */
// https://www.iconfinder.com/free_icons
class ChatsRouter {
  constructor() {
    this.controller = new ChatController();
  }

  start() {
    routerChats.get("/", this.controller.getChat);

    routerChats.get("*", this.controller.errorChat);

    return routerChats;
  }
}

module.exports = ChatsRouter;
