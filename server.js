/* -------------------------------- Modulos -------------------------------- */
const { Server: HttpServer } = require("http");
const { Server: Socket } = require("socket.io");

const express = require("express");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");
const logger = require("./src/utils/logger.js");
const swaggerUi = require("swagger-ui-express");

const ProductsRouter = require("./src/routes/products.routes");
const CartRouter = require("./src/routes/cart.routes");
const RegisterRouter = require("./src/routes/Register.routes");
const LoginRouter = require("./src/routes/login.routes");
const ChatsRouter = require("./src/routes/chat.routes");
const { swaggerSpecs } = require("./src/routes/swaggerSpecs.routes.js");

const addChatHandlers = require("./src/ws/chat.ws.js");

/* -------------------------------- Instancia de Express ------------------------ */
const app = express();

const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

io.on("connection", async (socket) => {
  addChatHandlers.configurarSocket(socket, io.sockets);
});

/* -------------------------------- Middlewares -------------------------------- */
app.use(express.json())
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

/* -------------------------------- Motor de plantillas -------------------------------- */
app.set("views", path.join(__dirname, "views"));
//Config extra para lo que es HBS
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: "hbs",
  })
);
//------------------------------------
app.set("view engine", "ejs");

/* -------------------------------- Server -------------------------------- */
const MODO_CLUSTER = process.argv[2] == "CLUSTER";

if (MODO_CLUSTER && cluster.isMaster) {
  logger.info(`num cpus: ${numCPUs}`);

  for (let index = 0; index < numCPUs; index++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    logger.info(
      `Worker ${process.pid} finalizo ${new Date().toLocaleString()}`
    );
    cluster.fork();
  });
} else {
  // console.log('Proceso hijo')
  //const PORT = parseInt(process.argv[2]) || 8080;
  const PORT = 8080;

  const server = httpServer.listen(PORT, () => {
    logger.info(
      `Server is running on port ${PORT} - PID WORKER ${process.pid}`
    );
  });

  server.on("error", (err) => {
    logger.warn(`Error en el servidor: ${err}`);
  });
}

/* -------------------------------- Rutas -------------------------------- */
/* Agregamos routers a la app */
app.use("/api/productos", new ProductsRouter().start());
app.use("/api/carrito", new CartRouter().start());
app.use("/register", new RegisterRouter().start());
app.use("/login", new LoginRouter().start());
app.use("/api/chats", new ChatsRouter().start());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


/* -------------------------- FORK ---------------------------- */
//node server.js FORK
//npm start FORK
//artillery quick -c 50 -n 50 "http://localhost:8080/api/productos" > artillery_fork.txt
/* ----------------------------------------------------------- */

/* -------------------------- CLUSTER ---------------------------- */
//node server.js CLUSTER
//npm start CLUSTER
//artillery quick -c 50 -n 50 "http://localhost:8080/api/productos" > artillery_cluster.txt
/* ----------------------------------------------------------- */
