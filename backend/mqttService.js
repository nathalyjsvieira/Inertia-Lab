require('dotenv').config();
const mqtt = require('mqtt');
const db = require('./db');

const client = mqtt.connect(process.env.MQTT_HOST, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  // Gera um ID único para a conexão do backend
  clientId: `inertia_backend_${Math.random().toString(16).slice(3)}` 
});

client.on('connect', () => {
  console.log('✅ Backend conectado ao HiveMQ!');
  
  // O símbolo '+' é um coringa no MQTT. Ouve dados de QUALQUER dispositivo cadastrado
  client.subscribe('inertia/device/+/data', (err) => {
    if (!err) console.log('📡 Ouvindo pacotes de telemetria...');
  });
});

client.on('message', async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());

    if (payload.status_final === 'concluido') {
      await db.query('UPDATE Jobs SET Status_Trabalho = "Concluído", Fim_Captura = NOW() WHERE ID_Job = ?', [payload.job_id]);
      console.log(`🛑 Job ${payload.job_id} concluído fisicamente.`);
      return; // Encerra a execução para este pacote
    }
    
    if (payload.data && Array.isArray(payload.data)) {
      const jobId = payload.job_id;
      const baseTs = payload.base_ts;
      
      // Extrai o ID do dispositivo direto da rota MQTT (ex: inertia/device/ESP32-MOCK99/data)
      const deviceId = topic.split('/')[2]; 
      
      // 1. VERIFICAÇÃO DE INTEGRIDADE: O Job já está registrado?
      const [jobCheck] = await db.query('SELECT ID_Job FROM Jobs WHERE ID_Job = ?', [jobId]);
      
      // Se não existe, o botão físico foi apertado na placa
      if (jobCheck.length === 0) {
        console.log(`⚡ Gatilho Físico! Criando Job Automático: ${jobId}`);
        
        await db.query(
          'INSERT INTO Jobs (ID_Job, Nome_Trabalho, Descricao, Status_Trabalho) VALUES (?, ?, ?, ?)',
          [jobId, 'Captura Manual (Hardware)', 'Iniciada fisicamente pelo sensor.', 'Em Andamento']
        );
      }

      // 2. INSERÇÃO DOS DADOS BRUTOS (Bulk Insert)
      const valoresParaInserir = payload.data.map(leitura => {
        const offset_ms = leitura[0];
        const timestampReal = baseTs + offset_ms;
        const x = parseFloat(leitura[1]);
        const y = parseFloat(leitura[2]);
        const z = parseFloat(leitura[3]);
        
        return [jobId, timestampReal, x, y, z];
      });

      if (valoresParaInserir.length > 0) {
        const query = 'INSERT INTO Leituras_Acelerometro (ID_Job, Timestamp_Leitura, Eixo_X, Eixo_Y, Eixo_Z) VALUES ?';
        await db.query(query, [valoresParaInserir]);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao processar pacote MQTT:', error.message);
  }
});

module.exports = client;