# Manual de Criação de Rotas (CRUD)

Este documento detalha o fluxo de criação de cada operação da API, explicando a responsabilidade de cada camada.

## Estrutura Base
- **Rota (Route):** A porta de entrada. Recebe a requisição HTTP (o pedido do cliente).
- **Serviço (Service):** O cérebro. Contém a regra de negócio (validações, cálculos, lógica).
- **Repositório (Repository):** O trabalhador. Comunica-se diretamente com o banco de dados (Prisma).

---

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

## 2. Rota de Criação (POST)
*Objetivo: Salvar um novo registro no banco de dados.*

**1. O Conceito: Request Body**
*   Para criar, precisamos enviar dados (nome, preço).
*   Esses dados vão "escondidos" no corpo da requisição (`request.body`) [1].
*   Diferente do GET (que usa URL) ou DELETE (que usa Params), o POST carrega um pacote de dados.

**2. O Estoquista (Repository)**
*   **Arquivo:** `src/repositories/ProductsRepository.ts`
*   **Função:** `create({ name, price, quantity })`
*   **Comando Prisma:** `prisma.product.create({ data: { ... } })`

**3. O Gerente (Service)**
*   **Arquivo:** `src/services/CreateProductService.ts`
*   **Classe:** `CreateProductService`
*   **Ação:** O método `execute` recebe os dados, pode validar (ex: verificar se já existe) e chama o repositório.

**4. A Porta de Entrada (Rota)**
*   **Arquivo:** `src/routes/products.routes.ts`
*   **Método HTTP:** `POST` [2]
*   **Status de Sucesso:** `201 Created` (Significa "Criado com sucesso") [3].
*   **Código:**
    1. Pegar dados do corpo: `const { name, price, quantity } = request.body;`
    2. Instanciar e executar o serviço.
    3. Retornar: `return response.status(201).json(product);`

## 3. Rota de Deletar (DELETE)
*Objetivo: Apagar um registro específico do banco de dados.*

**1. O Conceito: Route Params**
*   Para deletar, precisamos dizer **QUAL** item apagar.
*   Usamos um parâmetro na URL (ex: `/products/:id`).
*   O `:` avisa que o que vem depois é uma variável.

**2. O Estoquista (Repository)**
*   **Arquivo:** `src/repositories/ProductsRepository.ts`
*   **Função:** `delete(id)`
*   **Comando Prisma:** `prisma.product.delete({ where: { id } })`
*   **Importante:** O `where` é obrigatório para não apagar a tabela toda (embora o delete do prisma exija where).

**3. O Gerente (Service)**
*   **Arquivo:** `src/services/DeleteProductService.ts`
*   **Classe:** `DeleteProductService`
*   **Ação:** O método `execute(id)` recebe o ID e repassa para o repositório.

**4. A Porta de Entrada (Rota)**
*   **Arquivo:** `src/routes/products.routes.ts`
*   **Método HTTP:** `DELETE`
*   **URL:** `/:id`
*   **Código:**
    1. Pegar o ID: `const { id } = request.params;`
    2. Instanciar e executar o serviço.
    3. Retornar status 204 (No Content): `return response.status(204).send();`

## 4. Rota de Atualizar (PUT)
*Objetivo: Alterar os dados de um registro existente.*

**1. O Conceito: Híbrido (Params + Body)**
*   A atualização é uma mistura de conceitos:
    *   Igual ao **DELETE**, precisamos do ID na URL para saber **QUEM** alterar (`/:id`).
    *   Igual ao **POST**, precisamos dos dados no Corpo (JSON) para saber **O QUE** alterar (novos valores).

**2. O Estoquista (Repository)**
*   **Arquivo:** `src/repositories/ProductsRepository.ts`
*   **Função:** `update(id, name, price, quantity)`
*   **Comando Prisma:** `prisma.product.update({ where: { id }, data: { ... } })`
*   **Nota:** O Prisma exige o `where` (para achar) e o `data` (para mudar).

**3. O Gerente (Service)**
*   **Arquivo:** `src/services/UpdateProductService.ts`
*   **Classe:** `UpdateProductService`
*   **Ação:** O método `execute` recebe TUDO (id, name, price, quantity) e repassa para o repositório.

**4. A Porta de Entrada (Rota)**
*   **Arquivo:** `src/routes/products.routes.ts`
*   **Método HTTP:** `PUT`
*   **URL:** `/:id`
*   **Código:**
    1. Pega ID na URL: `const { id } = request.params;`
    2. Pega Dados no Corpo: `const { name, ... } = request.body;`
    3. Executa o serviço passando tudo.
    4. Retorna o produto atualizado (Status 200).

---
# A Anatomia dos Arquivos (Templates)

Esta seção detalha a estrutura interna de cada camada, servindo como um "molde" para novas funcionalidades.

## 1. A Anatomia do Repositório (O Estoquista)

**Objetivo:** A única função deste arquivo é saber conversar com o Banco de Dados (usando o Prisma). Ele não toma decisões de negócio; ele apenas executa ordens de guardar, buscar ou apagar dados.

*   **Padrão de Nome:** `src/repositories/NomeDoRecursoRepository.ts`
*   **Exemplos:** `ProductsRepository.ts`, `ClientsRepository.ts`

### 💻 O Código Modelo

```typescript
// 1. IMPORTAÇÕES
// Trazemos a "chave do armazém" (o prisma) para abrir o banco de dados.
import { prisma } from "../database/prismaClient"; 

// 2. A CLASSE (O Cargo)
// Por convenção, o nome da classe termina com "Repository".
class NomeDoRecursoRepository {

    // 3. MÉTODOS (As Tarefas)
    // Cada função é uma ordem que o estoquista sabe cumprir.
    
    // TAREFA: CRIAR (Create)
    // "async": Avisa que vai demorar um pouco (acesso ao banco).
    async create( { dados_que_chegam } : TipoDosDados ) {
        
        // "await": Espere o banco responder antes de continuar.
        const itemCriado = await prisma.nomeDaTabelaNoBanco.create({
            data: {
                // Mapeamos o que chegou para o que o banco espera
                campo1: dados_que_chegam.campo1,
                campo2: dados_que_chegam.campo2
            }
        });

        // Devolve o item pronto (geralmente com o ID gerado).
        return itemCriado;
    }

    // TAREFA: LISTAR (Read)
    async findAll() {
        const listaDeItens = await prisma.nomeDaTabelaNoBanco.findMany();
        return listaDeItens;
    }

    // TAREFA: ATUALIZAR (Update)
    // Precisa do ID (quem mudar) e dos Dados (o que mudar)
    async update(id: string, novos_dados: TipoDosDados) {
        const itemAtualizado = await prisma.nomeDaTabelaNoBanco.update({
            where: { id: id }, // ONDE está o item?
            data: { ...novos_dados } // QUAIS são os novos dados?
        });
        return itemAtualizado;
    }

    // TAREFA: DELETAR (Delete)
    // Só precisa do ID para achar e apagar.
    async delete(id: string) {
        await prisma.nomeDaTabelaNoBanco.delete({
            where: { id: id }
        });
        // Delete pode retornar o item removido ou nada (void).
    }
}

// 4. EXPORTAÇÃO
// Permite que o arquivo do "Gerente" (Service) use esta classe.
export { NomeDoRecursoRepository };
```
---
### 🔗 Pontos de Conexão
*   **Quem chama este arquivo?** O **Service** (Gerente).
    *   *Regra:* Ninguém mais deve falar direto com o Repositório. A Rota nunca chama o Repositório diretamente sem passar pelo Service.
*   **Quem este arquivo chama?** O **Prisma** (Banco de Dados).

### 🧹 Dicas de Código Limpo (Aplicadas aqui)
1.  **Nomes Significativos:** Usamos verbos claros como `create`, `update`, `delete` e `findAll`. O nome deve revelar o propósito do método, evitando que tenhamos que ler o código interno para entender o que ele faz.
2.  **Responsabilidade Única (SRP):** Este arquivo faz **uma única coisa**: manipulação de dados.
    *   Ele **não** valida se o e-mail tem `@`.
    *   Ele **não** checa se o preço é negativo.
    *   Isso garante que, se mudarmos o banco de dados, só mexemos aqui. Se mudarmos a regra de negócio, só mexemos no Service.

--------------------------------------------------------------------------------

## 2. A Anatomia do Serviço (O Gerente)

**Objetivo:** Este arquivo contém a **Lógica de Negócio**. Ele é responsável por validar as informações, fazer cálculos e decidir se a operação pode continuar. Ele não sabe o que é HTTP (request/response) e não sabe SQL direto; ele trabalha com dados puros.

*   **Padrão de Nome:** `src/services/VerboSubstantivoService.ts`
*   **Exemplos:** `CreateProductService.ts`, `UpdateClientService.ts`

### 💻 O Código Modelo

```typescript
// 1. IMPORTAÇÕES
// Importamos o molde do Repositório para saber quais ferramentas temos.
import { NomeDoRepositorio } from "../repositories/NomeDoRepositorio";

class NomeDoServico {
    
    // 2. O CONSTRUTOR (A Contratação)
    // Aplicamos a "Injeção de Dependência". 
    // O Service não cria o repositório, ele RECEBE um pronto para usar.
    constructor(private repository: NomeDoRepositorio) {}

    // 3. O MÉTODO EXECUTE (O Trabalho)
    // Recebe apenas os dados necessários (sem req/res).
    async execute(dados: TipoDosDados) {
        
        // --- ETAPA A: VALIDAÇÕES (Regras de Negócio) ---
        // Aqui perguntamos: "Isso pode ser feito?"
        
        // Exemplo: Verificar se o item já existe
        const itemExiste = await this.repository.findByName(dados.nome);
        
        if (itemExiste) {
            // Se algo estiver errado, lançamos um erro (paramos tudo).
            throw new Error("Este item já está cadastrado!"); 
        }

        // Exemplo: Validar valores
        if (dados.preco < 0) {
            throw new Error("O preço não pode ser negativo!");
        }

        // --- ETAPA B: AÇÃO ---
        // Se passou pelas validações, mandamos o estoquista trabalhar.
        const novoItem = await this.repository.create(dados);

        // --- ETAPA C: RETORNO ---
        // Devolvemos o resultado para quem chamou (a Rota).
        return novoItem;
    }
}

export { NomeDoServico };
```

---
### 🔗 Pontos de Conexão
*   **Quem chama este arquivo?** A **Rota** (Controller).
    *   *Fluxo:* A Rota extrai os dados da requisição (HTTP), instancia o Service e chama o método `execute`.
*   **Quem este arquivo chama?** O **Repositório**.
    *   *Fluxo:* O Service valida os dados e, se tudo estiver ok, chama os métodos do repositório (`create`, `delete`, `find`) para persistir no banco.

### 🧹 Dicas de Código Limpo (Aplicadas aqui)
1.  **Tratamento de Erro:** Usamos `throw new Error` para parar o fluxo quando uma regra é quebrada [1, 2]. Isso separa o "caminho feliz" (sucesso) do tratamento de exceções.
2.  **Responsabilidade Única (SRP):** Cada Service faz apenas **uma** tarefa específica (ex: Criar Produto) [3, 4]. Não misturamos "Criar" com "Listar" na mesma classe, para evitar que mudanças em uma funcionalidade quebrem a outra.
3.  **Nomes Descritivos:** Variáveis como `itemExiste` ou `novoItem` deixam claro o contexto do dado, evitando a necessidade de comentários excessivos para explicar o que o código faz [5, 6].

---

## 3. A Anatomia da Rota (O Garçom)

**Objetivo:** É a porta de entrada da API. Sua única função é receber a requisição HTTP (o pedido), entregar os dados para o Service competente e devolver uma resposta HTTP (o prato pronto) para quem pediu.

*   **Arquivo Genérico:** `src/routes/nomeDoRecurso.routes.ts`
*   **Conceito Chave:** HTTP (HyperText Transfer Protocol) - A língua que a internet fala.

### 💻 O Código Modelo

```typescript
// 1. IMPORTAÇÕES
import { Router } from 'express';
// Importamos os "moldes" do Repositório e do Serviço que vamos usar
import { NomeDoRepositorio } from '../repositories/NomeDoRepositorio';
import { NomeDoServico } from '../services/NomeDoServico';

// Cria o roteador (o "menu" de opções para este recurso)
const recursoRouter = Router();

// 2. DEFINIÇÃO DA ROTA (O Item do Menu)
// .post, .get, .put, .delete são os "verbos" do HTTP (o tipo de ação)
recursoRouter.post('/', async (request, response) => {
    
    // --- ETAPA A: RECEBER O PEDIDO (Entrada) ---
    // Extraímos os dados que vieram na requisição.
    // Pode vir do Corpo (body) -> Para criar/editar dados (JSON)
    // Pode vir da URL (params) -> Para identificar itens (/:id)
    const { dado1, dado2 } = request.body; 

    // --- ETAPA B: PREPARAR O TERRENO (Injeção de Dependências) ---
    // 1. Contratamos o Estoquista (Instanciamos o Repositório)
    const repositorio = new NomeDoRepositorio();
    
    // 2. Contratamos o Gerente e entregamos a ferramenta (o repositório) para ele
    const servico = new NomeDoServico(repositorio);

    // --- ETAPA C: EXECUTAR (Processamento) ---
    // O Garçom (Rota) não cozinha! Ele manda o Gerente (Service) fazer.
    // Passamos apenas os dados limpos, sem o objeto "request" inteiro.
    const resultado = await servico.execute({ 
        dado1, 
        dado2 
    });

    // --- ETAPA D: RESPONDER (Saída) ---
    // Devolvemos o resultado com um Status Code apropriado.
    // 200 = OK | 201 = Criado | 204 = Sem Conteúdo (Delete)
    return response.status(201).json(resultado);
});

// Exportamos para que o servidor principal (server.ts) possa usar
export { recursoRouter };
```
---
### 🔗 Pontos de Conexão
*   **Quem chama este arquivo?** O **Cliente** (Navegador, Insomnia, Front-end) através da Internet/Rede [1, 2].
*   **Quem este arquivo chama?** O **Service** (Gerente).
    *   *Regra de Ouro:* A Rota **nunca** deve conter regras de negócio (ex: "se preço < 0"). A Rota só repassa dados. Quem valida é o Service.

### 🧹 Dicas de Código Limpo (Aplicadas aqui)
1.  **Separação de Camadas:** A rota lida apenas com HTTP (req/res). Ela não sabe salvar no banco, ela não sabe calcular imposto. Isso mantém o código organizado e testável [3].
2.  **Verbos HTTP Corretos:**
    *   Use `POST` para criar [4].
    *   Use `GET` para ler [5].
    *   Use `PUT` para atualizar [6].
    *   Use `DELETE` para apagar [7].
    *   *Por que?* Isso torna sua API previsível e padronizada para qualquer desenvolvedor do mundo [8].
3.  **Status Codes Significativos:** Não retorne apenas 200 para tudo [9].
    *   Criou algo novo? Retorne `201 Created` [10, 11].
    *   Deu erro porque o cliente mandou dado errado? Retorne `400 Bad Request` [9, 12].
    *   Deletou com sucesso? Retorne `204 No Content` [13].
