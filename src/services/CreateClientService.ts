import { ClientsRepository } from "../repositories/ClientsRepository";

type TCreateUser = {
    name: string,
    email: string
}

class CreateClientService {

    constructor(private clientsRepository: ClientsRepository) { };

    async execute({ name, email }: TCreateUser) {

        const client = await this.clientsRepository.create({
            name,
            email
        });

        return client;
    }
}

export { CreateClientService };