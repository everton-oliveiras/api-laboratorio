# 📚 Manual: Criando uma API do Zero (Playground)

Este projeto é um guia de estudos passo a passo para criar uma API RESTful utilizando Node.js e TypeScript, focado em entender a arquitetura em camadas (Repository, Service, Controller).

## 📂 Passo 1: Estrutura Inicial

1. **Criação da Pasta**:
   - Comando: `mkdir api-produtos-playground`
   - Objetivo: Isolar os arquivos do projeto em um diretório específico para organização.

## 📦 Passo 2: Configurando o Git (Versionamento)

1. **Iniciar o Repositório**:
   - Comando: `git init`
   - Objetivo: Inicializa o monitoramento do Git na pasta, criando o diretório oculto `.git`.

2. **Padronizar a Branch**:
   - Comando: `git branch -M main`
   - Objetivo: Define o nome da branch principal como "main" (boas práticas atuais).

3. **Primeiro Commit**:
   - Comandos:
     - `git add .` (Prepara todos os arquivos da pasta para serem salvos).
     - `git commit -m "Estrutura inicial"` (Salva a versão atual no histórico com uma mensagem).

## 🛠️ Passo 3: Instalação de Dependências

1. **Inicializar o Node.js**:
   - Comando: `npm init -y`
   - Objetivo: Cria o arquivo `package.json` para gerenciar as dependências.

2. **Instalar TypeScript e Ferramentas**:
   - Comando: `npm install typescript @types/node ts-node-dev -D`
   - Objetivo: Adiciona suporte à tipagem e ferramentas de desenvolvimento (hot-reload).

3. **Configurar TypeScript**:
   - Comando: `npx tsc --init`
   - Objetivo: Gera o arquivo `tsconfig.json`.
   - **Ação Vital:** Abra o arquivo `tsconfig.json`, apague tudo o que estiver dentro dele e cole o código abaixo. Isso garante que o VS Code encontre seus arquivos (tirando o vermelho do `tsconfig.json`) e aceite o Express (tirando o vermelho do `server.ts`):
     ```json
     {
       "compilerOptions": {
         "target": "es2016",
         "module": "commonjs",
         "esModuleInterop": true,
         "forceConsistentCasingInFileNames": true,
         "strict": true,
         "skipLibCheck": true,
         "outDir": "./dist",
         "rootDir": "./src"
       },
       "include": ["src"]
     }
     ```

4. **Instalar Express (Servidor)**:
   - Comando: `npm install express` e `npm install @types/express -D`
   - Objetivo: Adiciona o framework web para criar as rotas e o servidor.

## 🚀 Passo 4: Criando o Servidor (Hello World)

1. **Criar o arquivo principal**:
   - Arquivo: `src/server.ts`
   - Objetivo: Configurar o Express, habilitar JSON e definir a porta 3333.

2. **Configurar Script de Execução**:
   - Arquivo: `package.json`
   - Adicionado script `"dev"`: Utiliza o `ts-node-dev` para rodar o projeto com reinicialização automática.

3. **Rodar o Projeto**:
   - Comando: `npm run dev`
   - Resultado: Servidor rodando na porta 3333.

   ## 🛣️ Passo 5: Estrutura de Rotas (Modular)

Para manter o código organizado e escalável (padrão de mercado), separamos as rotas do arquivo principal.

1. **Criar Rota de Produtos**:
   - **Arquivo:** `src/routes/products.routes.ts`
   - **Objetivo:** Conter apenas as regras de rotas relacionadas a "Produtos".
   - **Código:** Define o `Router` do Express e cria um endpoint `GET /` para teste.

2. **Criar o Gerenciador de Rotas (Index)**:
   - **Arquivo:** `src/routes/index.ts`
   - **Objetivo:** Funcionar como um "Hub" ou "Recepcionista". Ele agrupa todos os arquivos de rotas do sistema (produtos, usuários, etc.) em um único lugar.
   - **Lógica:** Usa `router.use('/products', productsRouter)` para definir o prefixo da URL.

3. **Conectar no Servidor**:
   - **Arquivo:** `src/server.ts`
   - **Ação:** O servidor deixa de cuidar das rotas diretamente e passa a importar apenas o `routes` (que carrega o index.ts automaticamente).
   - **Comando:** `app.use(router);`

---
**Resultado:** Ao acessar `http://localhost:3333/products` no navegador, o servidor responde com o JSON de teste, confirmando que o fluxo `Server -> Index -> Products` está funcionando.

## 🗄️ Passo 6: Configurando o Banco de Dados (Prisma + SQLite)

1. **Instalar Dependências (Versão Estável)**:
   - Para evitar conflitos, usamos a versão 5 do Prisma.
   - Comandos:
     `npm install prisma@5.10.2 -D`
     `npm install @prisma/client@5.10.2`

2. **Inicializar o Prisma**:
   - Comando: `npx prisma init --datasource-provider sqlite`
   - Resultado: Cria a pasta `prisma` e o arquivo `.env`.

3. **Configurar o Schema**:
   - Arquivo: `prisma/schema.prisma`
   - Definimos o modelo `Product` com id, nome, preço e quantidade.

4. **Criar a Tabela (Migrate)**:
   - Comando: `npx prisma migrate dev --name init`
   - Resultado: Cria o arquivo `dev.db` e gera o cliente Prisma (a ponte entre o código e o banco).

## 🔌 Passo 7: Configurando o Cliente do Banco (Prisma Client)

1. **Criar o Arquivo de Conexão**:
   - Arquivo: `src/lib/prisma.ts`
   - **Objetivo:** Centralizar a conexão com o banco de dados. Em vez de abrir uma conexão nova em cada arquivo (o que pesaria no sistema), criamos uma única instância exportada para ser reutilizada por todos os repositórios.

## 🏭 Passo 8: Criando o Repositório (Camada de Dados)

1. **Criar o Arquivo**:
   - Arquivo: `src/repositories/ProductsRepository.ts`
   - **Objetivo:** Isolar todas as operações de banco de dados.
   - **Métodos Criados:**
     - `create`: Insere um novo produto usando `prisma.product.create`.
     - `findByName`: Busca um produto pelo nome (útil para validações).

## 🧠 Passo 9: Camada de Serviço (Regras de Negócio)

1. **Criar o Arquivo**:
   - Arquivo: `src/services/CreateProductService.ts`
   - **Objetivo:** Conter a inteligência do cadastro. Ele não sabe HTTP (req/res), ele só sabe dados e regras.
   - **Lógica:**
     1. Recebe os dados do produto.
     2. Verifica no Repositório se já existe um produto com esse nome.
     3. Se existir, lança um erro (`throw new Error`).
     4. Se não, chama o Repositório para salvar.

## 🛣️ Passo 10: Rota com Lógica de Controle (Padrão Simplificado)

1. **Editar o Arquivo de Rota**:
   - **Arquivo:** `src/routes/products.routes.ts`
   - **Objetivo:** Receber a requisição, chamar o Service e devolver a resposta (tudo no mesmo arquivo, conforme padrão da empresa).
   - **Fluxo:**
     1. Recebe `name`, `price`, `quantity` do `req.body`.
     2. Instancia o `ProductsRepository` e o `CreateProductService`.
     3. Executa o serviço: `await createProductService.execute(...)`.
     4. Retorna Sucesso: Status `201` (Created) com o produto criado [1].
     5. Retorna Erro: Status `400` (Bad Request) caso o produto já exista (capturado no `catch`).

## 🧪 Passo 10: Testando a API (Insomnia)

Utilizamos o Insomnia para simular um cliente enviando dados para nossa API.

1. **Configurar Requisição**:
   - **Método**: `POST` (Utilizado para criar novos registros) [1].
   - **URL**: `http://localhost:3333/products`
   - **Body (JSON)**:
     ```json
     {
       "name": "Teclado Mecânico",
       "price": 150.00,
       "quantity": 5
     }
     ```

2. **Validar Resposta**:
   - **Status Esperado**: `201 Created` (Indica que o recurso foi criado com sucesso) [5].
   - **Dado Esperado**: O objeto JSON contendo o `id` gerado pelo banco de dados (UUID).