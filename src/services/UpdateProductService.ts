import { ProductsRepository } from "../repositories/ProductsRepository";

class UpdateProductService {
    // 1. A Contratação: O Gerente precisa do Estoquista (Repository)
    // Erro corrigido: mudamos de 'updateProductService' para 'productsRepository'
    constructor(private readonly productsRepository: ProductsRepository) {}

    // 2. A Execução: Recebe os dados e manda o estoquista atualizar
    async execute(id: string, name: string, price: number, quantity: number) {
        
        // Chamamos o método .update que criamos lá no repositório
        const product = await this.productsRepository.update(
            id, 
            name, 
            price, 
            quantity
        );

        return product;
    }
}

export { UpdateProductService };