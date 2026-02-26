import { Router } from 'express';
import { productsRouter } from './products.routes';
import { clientsRouter } from './clients.routes';

const router = Router();

router.use('/products', productsRouter);
router.use('/clients', clientsRouter);

export { router };