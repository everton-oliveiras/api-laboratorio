import { prisma } from "../lib/prisma";

class ClientsRepository {

    public async create(data: { name: string, email: string }) {
        const client = await prisma.client.create({
            data,
        });
        return client;
    }
}

export { ClientsRepository }