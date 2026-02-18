import { prisma } from '../lib/prisma';

export class ProductsRepository {
    // Função para salvar no banco
    async create(data: { name: string; price: number; quantity: number }) {
        const product = await prisma.product.create({
            data,
        });
        return product;
    }

    // Função para buscar por nome (para evitar duplicados)
    async findByName(name: string) {
        const product = await prisma.product.findFirst({
            where: {
                name,
            },
        });
        return product;
    }

    async findAll() {
        const products = await prisma.product.findMany()
        return products;
    }

    async delete(id: string) {
        const product = await prisma.product.delete({
            where: {
                id
            },
        });
        return product;
    }

    async update(id: string, name: string, price: number, quantity: number) {
        const product = await prisma.product.update({
            where: {
                id: id,
            },
            data: {
                name,
                price,
                quantity,
            },
        });
        return product;
    }
}