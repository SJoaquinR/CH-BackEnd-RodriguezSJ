const mensajesApi = require("../apis/chatApi.js");

async function configurarSocket(socket, sockets) {
  // carga inicial de mensajes
  socket.emit("mensajes", await mensajesApi.listarAll());

  // actualizacion de mensajes
  socket.on("nuevoMensaje", async (mensaje) => {
    mensaje.fyh = new Date().toLocaleString();
    await mensajesApi.guardar(mensaje);
    sockets.emit("mensajes", await mensajesApi.listarAll());
  });
}

module.exports = { configurarSocket };
