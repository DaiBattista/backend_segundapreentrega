import fs from "fs";

const cartsFilePath = "./src/models/carts.json";

// Función para guardar los datos de los carritos en el archivo JSON
function saveCarts(carts) {
    fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), (err) => {
        if (err) {
            console.error("Error al guardar carritos", err);
        } else {
            console.log("Carritos guardados correctamente");
        }
    });
}

// Obtener todos los carritos
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

// Crear un nuevo carrito
export const createCart = (req, res) => {
};

// Obtener un carrito por ID
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

// Agregar un producto a un carrito
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

        // Verifica si el producto ya está en el carrito
        const existingProduct = carts[cartIndex].products.find((product) => product.id === productId);

        if (!existingProduct) {
            // Si el producto no existe en el carrito, agregarlo
            carts[cartIndex].products.push({ id: productId, quantity });
        } else {
            // Si el producto ya está en el carrito, incrementar la cantidad
            existingProduct.quantity += quantity;
        }

        // Guardar los cambios en el archivo JSON
        saveCarts(carts);

        res.json(carts[cartIndex]);
    } catch (err) {
        console.error("Error al leer el archivo carts.json", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export { saveCarts };
