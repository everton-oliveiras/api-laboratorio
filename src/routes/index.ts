import { Router } from 'express';
import { productsRouter } from './products.routes';

const router = Router();

// Sempre que acessarem "/products", o sistema manda para o arquivo de produtos
router.use('/products', productsRouter);

export { router };