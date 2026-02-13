import { ProductsRepository } from '../repositories/ProductsRepository';

interface CreateProductRequest {
  name: string;
  price: number;
  quantity: number;
}

export class CreateProductService {
  // Recebe o repositório no construtor (Injeção de Dependência simples)
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ name, price, quantity }: CreateProductRequest) {
    // 1. Regra: Não pode duplicar nome
    const productAlreadyExists = await this.productsRepository.findByName(name);

    if (productAlreadyExists) {
      throw new Error("Product already exists");
    }

    // 2. Cria o produto
    const product = await this.productsRepository.create({
      name,
      price,
      quantity,
    });

    return product;
  }
}