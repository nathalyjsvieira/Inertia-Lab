const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('./mqttService');

const app = express();

// Configurações Globais de Middleware
app.use(cors()); // Permite requisições do seu Frontend React
app.use(express.json()); // Permite leitura de JSON nos payloads de requisição

// Vincula todas as rotas criadas sob o prefixo /api
app.use('/api', routes);

// Rota base de verificação do Servidor
app.get('/', (req, res) => {
  res.send('Servidor Central da Inertia Labs está Online!');
});

// Configuração da Porta de Execução
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  INERTIA LABS - BACKEND INDUSTRIAL INICIALIZADO  `);
  console.log(`  Servidor rodando com sucesso na porta: ${PORT}   `);
  console.log(`==================================================`);
});