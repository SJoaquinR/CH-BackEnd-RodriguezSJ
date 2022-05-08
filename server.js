/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");

//const routerProducts = express.Router();
const routerProducts = require("./routes/products.routes");
const routerCart = require("./routes/cart.routes");
const routerRegister = require("./routes/Register.routes");
const routerLogin = require("./routes/login.routes");

/* -------------------------------- Instancia de Express ------------------------ */
const app = express();

/* -------------------------------- Middlewares -------------------------------- */
app.use(express.static("public"));

routerProducts.use(express.json());
routerCart.use(express.json());
routerRegister.use(express.json());
routerLogin.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

/* -------------------------------- Motor de plantillas -------------------------------- */
app.set('views', path.join(__dirname, 'views'));
//Config extra para lo que es HBS
app.engine('hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: 'hbs'
}));
//------------------------------------
app.set('view engine', 'ejs');

/* -------------------------------- Server -------------------------------- */
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (err) => {
  console.log(`Error en el servidor: ${err}`);
});

/* -------------------------------- Rutas -------------------------------- */
/* Agregamos routers a la app */
app.use("/api/productos", routerProducts);
app.use("/api/carrito", routerCart);
app.use("/register", routerRegister);
app.use("/login", routerLogin);

//Ruta inicio
// app.get("/", (req, res) => {
//   res.render('pages/login');
// });
