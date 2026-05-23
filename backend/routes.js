require('dotenv').config();

const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcryptjs');

router.post('/auth/login', async (req, res) => {
  const { login, senha } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM Usuarios WHERE Login = ?', [login]);
    if (rows.length === 0) return res.status(401).json({ erro: 'Usuário não encontrado' });

    const usuario = rows[0];
    const hashString = usuario.Hash_Senha.toString();
    const senhaValida = await bcrypt.compare(senha, hashString);

    if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta' });
    if (!usuario.Status_Atividade) return res.status(403).json({ erro: 'Usuário inativo' });

    res.json({ 
      mensagem: 'Login efetuado com sucesso!',
      usuario: { id: usuario.ID_Usuario, nome: usuario.Nome_Exibicao, acesso: usuario.Grau_Acesso }
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT ID_Usuario, Nome_Exibicao, Login, Telefone_Contato, Grau_Acesso, Status_Atividade FROM Usuarios');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post('/usuarios', async (req, res) => {
  const { nome, login, senha, telefone, acesso } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senha, salt);

    const query = 'INSERT INTO Usuarios (Nome_Exibicao, Login, Hash_Senha, Telefone_Contato, Grau_Acesso) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [nome, login, hash, telefone, acesso]);
    res.status(201).json({ mensagem: 'Usuário criado com sucesso!', id: result.insertId });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Rota para Atualizar o Perfil (E-mail e Senha) do usuário logado
router.put('/usuarios/perfil', async (req, res) => {
  const { email, novaSenha } = req.body;
  try {
    // Para simplificar na apresentação, vamos atualizar o usuário admin (ID 1)
    if (novaSenha) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(novaSenha, salt);
      await db.query('UPDATE Usuarios SET Login = ?, Hash_Senha = ? WHERE ID_Usuario = 1', [email, hash]);
    } else {
      await db.query('UPDATE Usuarios SET Login = ? WHERE ID_Usuario = 1', [email]);
    }
    res.json({ mensagem: 'Perfil atualizado com sucesso no banco de dados!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Rota para Deletar Usuário do sistema
router.delete('/usuarios/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Usuarios WHERE ID_Usuario = ?', [req.params.id]);
    res.json({ mensagem: 'Usuário removido com sucesso do banco de dados!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get('/maquinas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Maquinas');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ROTA NOVA: Busca as máquinas e a última leitura de telemetria de cada uma
router.get('/maquinas/dashboard', async (req, res) => {
  try {
    const query = `
      SELECT m.ID_Maquina, m.Nome_Operacional, m.ID_MCU_Vinculado,
             t.Velocidade_RMS, t.Aceleracao_Pico, t.Deslocamento_PP, t.Alerta_Status, t.Timestamp_UTC
      FROM Maquinas m
      LEFT JOIN (
          SELECT t1.*
          FROM Telemetria t1
          INNER JOIN (
              SELECT ID_Maquina, MAX(Timestamp_UTC) as UltimaLeitura
              FROM Telemetria
              GROUP BY ID_Maquina
          ) t2 ON t1.ID_Maquina = t2.ID_Maquina AND t1.Timestamp_UTC = t2.UltimaLeitura
      ) t ON m.ID_Maquina = t.ID_Maquina
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post('/maquinas', async (req, res) => {
  const { nome, tipo, rpm, localizacao, mcu_id } = req.body;
  try {
    const query = 'INSERT INTO Maquinas (Nome_Operacional, Tipo_Equipamento, RPM_Nominal, Localizacao_Fisica, ID_MCU_Vinculado) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [nome, tipo, rpm, localizacao, mcu_id]);
    res.status(201).json({ mensagem: 'Máquina cadastrada!', id: result.insertId });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.delete('/maquinas/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Maquinas WHERE ID_Maquina = ?', [req.params.id]);
    res.json({ mensagem: 'Máquina removida com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Rota para listar todos os microcontroladores (sensores) cadastrados no banco
router.get('/microcontroladores', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT ID_MCU, Nome_Dispositivo, Modelo FROM Microcontroladores');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post('/telemetria', async (req, res) => {
  const { 
    ID_Maquina, Velocidade_RMS, Aceleracao_Pico, 
    Deslocamento_PP, Freq_Dominante, Angulo_Fase, Temperatura, Alerta_Status 
  } = req.body;

  try {
    const query = `
      INSERT INTO Telemetria 
      (ID_Maquina, Velocidade_RMS, Aceleracao_Pico, Deslocamento_PP, Freq_Dominante, Angulo_Fase, Temperatura, Alerta_Status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      ID_Maquina, Velocidade_RMS, Aceleracao_Pico, 
      Deslocamento_PP, Freq_Dominante, Angulo_Fase, Temperatura, Alerta_Status
    ]);
    res.status(201).json({ mensagem: 'Dados de telemetria salvos!', id: result.insertId });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get('/telemetria/:id_maquina', async (req, res) => {
  try {
    const query = `
      SELECT * FROM Telemetria 
      WHERE ID_Maquina = ? 
      ORDER BY Timestamp_UTC DESC 
      LIMIT 30
    `;
    const [rows] = await db.query(query, [req.params.id_maquina]);
    res.json(rows.reverse());
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

const nodemailer = require('nodemailer');

// Rota oficial para enviar o formulário de contato
router.post('/contato', async (req, res) => {
  const { nome, email } = req.body;

  // Configuração do "carteiro" (Você precisará colocar os dados de um e-mail real aqui depois)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Pode ser outlook, yahoo, etc.
    auth: {
      user: 'SEU_EMAIL_AQUI@gmail.com',
      pass: 'SUA_SENHA_DE_APP_AQUI'
    }
  });

  const mailOptions = {
    from: 'SEU_EMAIL_AQUI@gmail.com',
    to: 'email-da-inertia@gmail.com', // E-mail que vai receber a mensagem
    subject: `Novo Contato do Site: ${nome}`,
    text: `Você recebeu uma nova solicitação de contato.\n\nNome: ${nome}\nE-mail Corporativo: ${email}`
  };

  try {
    // Tenta enviar o e-mail
    await transporter.sendMail(mailOptions);
    res.status(200).json({ mensagem: 'E-mail enviado com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao enviar e-mail: ' + error.message });
  }
});

module.exports = router;