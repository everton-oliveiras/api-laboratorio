import { Router } from "express";
import { ClientsRepository } from "../repositories/ClientsRepository";
import { CreateClientService } from "../services/CreateClientService";

const clientsRouter = Router();

const clientsRepository = new ClientsRepository();
const createClientService = new CreateClientService(clientsRepository);

clientsRouter.post('/', async (request, response) => {

    const { name, email } = request.body;

    const client = await createClientService.execute({
        name,
        email
    });

    return response.status(201).json(client);
})

export { clientsRouter };