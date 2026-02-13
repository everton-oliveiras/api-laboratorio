import express from 'express';
import { router } from './routes'; // Importa o nosso gerenciador de rotas

const app = express();

// Habilita o servidor para entender dados no formato JSON
app.use(express.json());
app.use(router); // Avisa ao servidor para usar as rotas

// Define a porta 3333 e inicia o servidor
app.listen(3333, () => {
  console.log("🔥 Server is running on port 3333");
});