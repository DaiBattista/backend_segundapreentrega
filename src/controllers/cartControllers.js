import fs from "fs";

const cartsFilePath = "./src/models/carts.json";

function saveCarts(carts) {
    fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), (err) => {
        if (err) {
            console.error("Error al guardar carritos", err);
        } else {
            console.log("Carritos guardados correctamente");
        }
    });
}

export const getAllCarts = (req, res) => {
    try {
        const cartsData = fs.readFileSync(cartsFilePath, "utf-8");
        const carts = JSON.parse(cartsData);
        res.json(carts);
    } catch (err) {
        console.error("Error al leer el archivo carts.json", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const createCart = (req, res) => {
};

export const getCartById = (req, res) => {
    const cartId = req.params.cid;
    try {
        const cartsData = fs.readFileSync(cartsFilePath, "utf-8");
        const carts = JSON.parse(cartsData);
        const cart = carts.find((cart) => cart.id === cartId);

        if (!cart) {
            res.status(404).json({ message: `El carrito con ID ${cartId} no existe` });
        } else {
            res.json(cart);
        }
    } catch (err) {
        console.error("Error al leer el archivo carts.json", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const addProductToCart = (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        let cartsData = fs.readFileSync(cartsFilePath, "utf-8");
        let carts = JSON.parse(cartsData);

        const cartIndex = carts.findIndex((cart) => cart.id === cartId);

        if (cartIndex === -1) {
            return res.status(404).json({ message: `El carrito con ID ${cartId} no existe` });
        }

        const existingProduct = carts[cartIndex].products.find((product) => product.id === productId);

        if (!existingProduct) {
            carts[cartIndex].products.push({ id: productId, quantity });
        } else {
            existingProduct.quantity += quantity;
        }

        saveCarts(carts);

        res.json(carts[cartIndex]);
    } catch (err) {
        console.error("Error al leer el archivo carts.json", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export { saveCarts };
