import { response, Router } from 'express';
import { ProductsRepository } from '../repositories/ProductsRepository';
import { CreateProductService } from '../services/CreateProductService';
import { ListProductsService } from '../services/ListProductService';

const productsRouter = Router();

productsRouter.post('/', async (req, res) => {
    const { name, price, quantity } = req.body;

    // Instancia as dependências aqui mesmo (padrão mais direto)
    const productsRepository = new ProductsRepository();
    const createProductService = new CreateProductService(productsRepository);

    try {
        // Chama o serviço que tem a regra de negócio
        const product = await createProductService.execute({
            name,
            price,
            quantity,
        });

        return res.status(201).json(product);
    } catch (err) {
        return res.status(400).json({ error: (err as Error).message });
    }
});

productsRouter.get('/', async (request, response) => {
    
    const productsRepository = new ProductsRepository();
    
    const listProductsService = new ListProductsService(productsRepository);

    const products = await listProductsService.execute();

    return response.status(200).json(products);

});



export { productsRouter };