import express from "express";
import { engine } from 'express-handlebars';
import { Server } from "socket.io";
import cartsRouter from "../src/routers/cartsrouter.js";
import productsRouter from "../src/routers/productsrouter.js";
import indexRouter from "../src/routers/indexrouter.js";

const app = express();
const PUERTO = 8080;

// Middleware
app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/", indexRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

import ProductControllers from "./controllers/productControllers.js";
const productControllers = new ProductControllers("./src/models/products.json");

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Cliente conectado");

    socket.emit("products", await productControllers.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await productControllers.deleteProduct(id);

        io.sockets.emit("products", await productControllers.getProducts());
    });

    socket.on("agregarProducto", async (producto) => {
        await productControllers.addProduct(producto);

        io.sockets.emit("products", await productControllers.getProducts());

    })
});

