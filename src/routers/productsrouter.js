import express from 'express';
import ProductControllers from '../controllers/productControllers.js';

const router = express.Router();
const productControllers = new ProductControllers("./src/models/products.json"); 

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productControllers.getProducts(); 
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code } = req.body;
        await productControllers.addProduct({ title, description, price, thumbnail, code }); 
        res.status(201).json({ message: 'Producto creado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

// Eliminar un producto por su id
router.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        await productControllers.deleteProduct(productId); 
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router;
