import { Router } from "express";
const router = Router();

import ProductControllers from "../controllers/productControllers.js";
const productControllers = new ProductControllers("./src/models/products.json");

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
});

router.get(["/products", "/home"], async (req, res) => {
    try {
        const products = await productControllers.getProducts();
        res.render("home", { products });
    } catch (error) {
        handleError(res, error);
    }
});

function handleError(res, error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
}

export default router;

