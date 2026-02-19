import { prisma } from "../lib/prisma";

type IClient = {
    name: string,
    email: string
}

class ClientsRepository {
    async create({ name, email }: IClient): Promise<IClient> {
        const client = await prisma.client.create({
            data: {
                name,
                email
            }
        })
        return client;
    }
}

export { ClientsRepository }