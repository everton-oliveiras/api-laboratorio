# Manual de Criação de Rotas (CRUD)

Este documento detalha o fluxo de criação de cada operação da API, explicando a responsabilidade de cada camada.

## Estrutura Base
- **Rota (Route):** A porta de entrada. Recebe a requisição HTTP (o pedido do cliente).
- **Serviço (Service):** O cérebro. Contém a regra de negócio (validações, cálculos, lógica).
- **Repositório (Repository):** O trabalhador. Comunica-se diretamente com o banco de dados (Prisma).

---

## 1. Rota de Listagem (GET)
*Objetivo: Buscar todos os registros do banco de dados.*

*(Aguardando definição do fluxo...)*

# Fluxo de Criação de Rotas (The Flow)

Para cada nova funcionalidade (Listar, Criar, Atualizar, Deletar), seguiremos sempre este caminho, do "fundo" para a "frente":

## 1. O Estoquista (Repository)
*   **Arquivo:** `src/repositories/ProductsRepository.ts`
*   **Responsabilidade:** Falar com o Banco de Dados.
*   **Ação:** Criamos uma função aqui que sabe executar o comando específico do Prisma (ex: `findMany`, `create`, `delete`).
*   **Por que começar aqui?** Porque sem saber como pegar o dado, o resto do sistema não funciona.

## 2. O Gerente (Service)
*   **Arquivo:** `src/services/NomeDoServico.ts`
*   **Responsabilidade:** Regras de Negócio.
*   **Ação:** Criamos uma classe que chama o Repositório. Se tiver validação (ex: "estoque não pode ser negativo"), é aqui que acontece.
*   **Por que separar?** Para deixar o código organizado. Se mudarmos o banco de dados, a regra de negócio não muda [5].

## 3. A Porta de Entrada (Rota/Controller)
*   **Arquivo:** `src/routes/products.routes.ts`
*   **Responsabilidade:** Receber o Pedido HTTP (Request) e Devolver a Resposta (Response) [2, 6].
*   **Ação:**
    1. Recebe a requisição (GET, POST, etc).
    2. Chama o Service.
    3. Devolve o resultado com o Status Code correto (200, 201, 400) [7, 8].

## 1. Rota de Listagem (GET)
*Objetivo: Buscar todos os registros do banco de dados.*

**1. O Estoquista (Repository)**
*   **Arquivo:** `src/repositories/ProductsRepository.ts`
*   **Função:** `findAll()`
*   **Comando Prisma:** `prisma.product.findMany()` (sem argumentos para trazer tudo).
*   **Retorno:** Uma lista (array) de produtos.

**2. O Gerente (Service)**
*   **Arquivo:** `src/services/ListProductsService.ts`
*   **Classe:** `ListProductsService`
*   **Ação:** O método `execute()` apenas chama o `repo.findAll()` e retorna o resultado. Não precisa de validações complexas aqui.

**3. A Porta de Entrada (Rota)**
*   **Arquivo:** `src/routes/products.routes.ts`
*   **Método HTTP:** `GET`
*   **Caminho:** `/`
*   **Código:**
    1. Instancia o Repositório.
    2. Instancia o Service (injetando o repositório).
    3. Executa o serviço: `const products = await service.execute();`
    4. Retorna: `return response.status(200).json(products);` (Não esquecer de passar a variável no json!)