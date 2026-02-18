import { response, Router } from 'express';
import { ProductsRepository } from '../repositories/ProductsRepository';
import { CreateProductService } from '../services/CreateProductService';
import { ListProductsService } from '../services/ListProductService';
import { DeleteProductService } from '../services/DeleteProductService';
import { UpdateProductService } from '../services/UpdateProductService';

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

productsRouter.delete('/:id', async (request, response) => {
  // 1. Pegar o ID que veio na URL
  // O 'id' aqui tem que ter o mesmo nome que usamos lá em cima no /:id
  const { id } = request.params; 

  // 2. Chamar o Estoquista e o Gerente (igual fizemos antes)
  const productsRepository = new ProductsRepository();
  const deleteProductService = new DeleteProductService(productsRepository);

  // 3. Mandar o gerente trabalhar (passando o ID que pegamos da URL)
  await deleteProductService.execute(id);

  // 4. Responder "Sem Conteúdo" (Padrão para Delete)
  // Status 204 = No Content (Sucesso, mas não tenho nada pra te mostrar de volta)
  return response.status(204).send();
});

productsRouter.put('/:id', async (request, response) => {
  // 1. Pegar o ID na URL (igual ao Delete)
  const { id } = request.params;

  // 2. Pegar os novos dados no Corpo (igual ao Post)
  const { name, price, quantity } = request.body;

  // 3. Chamar o Estoquista e o Gerente
  const productsRepository = new ProductsRepository();
  const updateProductService = new UpdateProductService(productsRepository);

  // 4. Executar
  const product = await updateProductService.execute(id, name, price, quantity);

  // 5. Responder
  return response.status(200).json(product);
});

export { productsRouter };