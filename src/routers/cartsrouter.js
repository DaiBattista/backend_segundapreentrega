import express from 'express';
const router = express.Router();
import * as cartControllers from '../controllers/cartControllers.js';

router.get('/', cartControllers.getAllCarts);
router.post('/', cartControllers.createCart);
router.get('/:cid', cartControllers.getCartById);
router.post('/:cid/product/:pid', cartControllers.addProductToCart);

export default router;

