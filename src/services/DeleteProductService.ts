import { ProductsRepository } from "../repositories/ProductsRepository";

class DeleteProductService {
    constructor(private readonly productsRepository: ProductsRepository) { }

    async execute(id: string) {
        const products = await this.productsRepository.delete(id);
        return products;
    }
}
export { DeleteProductService };