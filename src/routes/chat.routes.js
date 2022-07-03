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

    // routerChats.post("/", this.controller.addChat);

    // routerChats.put("/:id", this.controller.updateChat);

    // routerChats.delete("/:id", this.controller.deleteChat);

    routerChats.get("*", this.controller.errorChat);

    return routerChats;
  }
}

module.exports = ChatsRouter;
