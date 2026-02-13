import { ProductsRepository } from "../repositories/ProductsRepository";

class ListProductsService {
    constructor(private productsRepository: ProductsRepository) { }

    async execute() {

        const products = await this.productsRepository.findAll();

        return products;
    }
}

export {ListProductsService};