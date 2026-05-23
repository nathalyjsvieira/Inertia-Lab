import React, { useState, useEffect } from 'react';
import {
  Activity, User, Users, LogOut, Sun, Moon,
  Settings, ZoomIn, Move, RotateCcw,
  Mail, Lock, Shield, Edit2, Trash2, Plus, Save, X
} from 'lucide-react';

export default function Dashboard({ colors, handleNavigation }) {
  // === ESTADOS DO SISTEMA ===
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeMenu, setActiveMenu] = useState('motores');
  const [graficoModo, setGraficoModo] = useState('realtime');

  const [motores, setMotores] = useState([]);
  const [selectedMotor, setSelectedMotor] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  // Estados do Perfil
  const [emailPerfil, setEmailPerfil] = useState('admin@inertialabs.com');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Estados dos Modais (Pop-ups)
  const [showModalMotor, setShowModalMotor] = useState(false);
  const [showModalUsuario, setShowModalUsuario] = useState(false);

  const [microcontroladores, setMicrocontroladores] = useState([]);

  // === 1. CONTROLE DO MODO ESCURO ===
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    return () => document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // === 2. OPERAÇÕES DE MOTORES (BANCO DE DADOS REAL) ===
  // === INTEGRAÇÃO COM BANCO (MOTORES + TELEMETRIA REAL) ===
  const carregarMotores = () => {
    // Agora bate na rota nova que traz os dados cruzados
    fetch('http://localhost:3000/api/maquinas/dashboard')
      .then(resposta => {
        if (!resposta.ok) throw new Error('Erro na resposta');
        return resposta.json();
      })
      .then(dadosDaApi => {
        const maquinasReais = dadosDaApi.map(maq => ({
          id: maq.ID_MCU_Vinculado || `MAQ-${maq.ID_Maquina}`,
          nome: maq.Nome_Operacional,

          // Se tiver status no banco, usa ele. Se não, avisa que não tem dados.
          status: maq.Alerta_Status || 'Sem Dados',

          // Puxa os dados reais da Telemetria (Se for null, coloca 0.00)
          velocidade: maq.Velocidade_RMS ? `${maq.Velocidade_RMS.toFixed(2)} mm/s` : '0.00 mm/s',
          aceleracao: maq.Aceleracao_Pico ? `${maq.Aceleracao_Pico.toFixed(2)} G` : '0.00 G',
          deslocamento: maq.Deslocamento_PP ? `${maq.Deslocamento_PP.toFixed(2)} µm` : '0.00 µm',

          // Converte o Timestamp do banco para o horário local do Brasil
          lastRead: maq.Timestamp_UTC ? new Date(maq.Timestamp_UTC).toLocaleString('pt-BR') : 'Aguardando sensor...'
        }));

        const motorSimuladoAlerta = {
          id: 'ESP32-MOCK99', nome: 'Bomba de Resfriamento (Simulação)', status: 'Alerta',
          velocidade: '12.45 mm/s', aceleracao: '3.20 G', deslocamento: '150.90 µm', lastRead: 'Telemetria Preditiva'
        };

        const listaFinal = [...maquinasReais, motorSimuladoAlerta];
        setMotores(listaFinal);
        if (!selectedMotor && listaFinal.length > 0) setSelectedMotor(listaFinal[0]);
      })
      .catch(() => {
        // Fallback offline de segurança
        const dadosSimulados = [
          { id: 'ESP32-DBD0F4', nome: 'Motor Esteira Principal', status: 'OK', velocidade: '2.02 mm/s', aceleracao: '0.05 G', deslocamento: '12.81 µm', lastRead: 'Modo Demonstração' },
          { id: 'ESP32-MOCK99', nome: 'Bomba de Resfriamento (Simulação)', status: 'Alerta', velocidade: '12.45 mm/s', aceleracao: '3.20 G', deslocamento: '150.90 µm', lastRead: 'Modo Demonstração' },
        ];
        setMotores(dadosSimulados);
        if (!selectedMotor) setSelectedMotor(dadosSimulados[0]);
      });
  };

  useEffect(() => { carregarMotores(); }, []);

  const handleAddMotorSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const novaMaquina = {
      nome: formData.get('nome'),
      tipo: formData.get('tipo'),
      rpm: parseFloat(formData.get('rpm')),
      localizacao: formData.get('localizacao'),
      mcu_id: formData.get('mcu_id')
    };

    try {
      const resposta = await fetch('http://localhost:3000/api/maquinas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaMaquina)
      });
      if (resposta.ok) {
        alert("Nova máquina gravada com sucesso no MySQL!");
        carregarMotores();
      }
    } catch (erro) {
      alert("Erro ao conectar na API.");
    }
    setShowModalMotor(false);
  };

  // === 3. OPERAÇÕES DE USUÁRIOS (BANCO DE DADOS REAL) ===
  const carregarUsuarios = () => {
    fetch('http://localhost:3000/api/usuarios')
      .then(res => {
        if (!res.ok) throw new Error('Erro na resposta do servidor');
        return res.json();
      })
      .then(dados => {
        // Trava de segurança: Só salva se for realmente uma lista
        if (Array.isArray(dados)) {
          setUsuarios(dados);
        } else {
          throw new Error('Formato de dados incorreto');
        }
      })
      .catch(() => {
        setUsuarios([
          { ID_Usuario: 1, Nome_Exibicao: 'Engenheiro Master', Login: 'admin@inertialabs.com', Telefone_Contato: '(11) 99999-9999', Grau_Acesso: 'Administrador' }
        ]);
      });
  };

  useEffect(() => {
    if (activeMenu === 'usuarios') carregarUsuarios();
  }, [activeMenu]);

  // Busca os sensores (microcontroladores) do banco ao abrir o modal de cadastro de máquina
  useEffect(() => {
    if (showModalMotor) {
      fetch('http://localhost:3000/api/microcontroladores')
        .then(res => res.json())
        .then(dados => {
          if (Array.isArray(dados)) {
            setMicrocontroladores(dados);
          }
        })
        .catch(() => {
          // Fallback caso o banco esteja inacessível na faculdade
          setMicrocontroladores([
            { ID_MCU: 'ESP32-DBD0F4', Nome_Dispositivo: 'Sensor Esteira Principal', Modelo: 'ESP32' },
            { ID_MCU: 'ESP32-A1B2C3', Nome_Dispositivo: 'Sensor Exaustor Norte', Modelo: 'ESP32' },
            { ID_MCU: 'ESP32-9F8E7D', Nome_Dispositivo: 'Sensor Bomba de Resfriamento', Modelo: 'ESP32' },
          ]);
        });
    }
  }, [showModalMotor]);

  const handleAddUsuarioSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const novoUsuario = {
      nome: formData.get('nome'),
      login: formData.get('login'),
      senha: formData.get('senha'),
      telefone: formData.get('telefone'),
      acesso: formData.get('acesso')
    };

    try {
      const resposta = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario)
      });
      if (resposta.ok) {
        alert("Novo operador salvo com sucesso no MySQL!");
        carregarUsuarios();
      }
    } catch (erro) {
      alert("Erro de conexão com o backend.");
    }
    setShowModalUsuario(false);
  };

  const deletarUsuario = async (id, nome) => {
    if (window.confirm(`Remover permanentemente o usuário ${nome} do banco de dados?`)) {
      try {
        const resposta = await fetch(`http://localhost:3000/api/usuarios/${id}`, { method: 'DELETE' });
        if (resposta.ok) {
          alert("Usuário deletado do banco de dados!");
          carregarUsuarios();
        }
      } catch (error) {
        alert("Erro ao conectar com o servidor.");
      }
    }
  };

  // === 4. OPERAÇÃO DE PERFIL (INTEGRAÇÃO REAL COM O BANCO) ===
  const handleAtualizarPerfil = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const resposta = await fetch('http://localhost:3000/api/usuarios/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailPerfil, novaSenha: novaSenha })
      });

      if (resposta.ok) {
        alert("Credenciais de perfil atualizadas com sucesso no MySQL!");
        setNovaSenha('');
        setConfirmarSenha('');
      } else {
        alert("Erro ao atualizar dados no servidor.");
      }
    } catch (erro) {
      alert("Erro de conexão com o banco de dados.");
    }
  };

  if (!selectedMotor) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-mono">Carregando dados estruturados...</div>;

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900 dark:bg-[#121212] dark:text-gray-100 font-sans transition-colors duration-300 relative">

      {/* MODAL: ADICIONAR MOTOR */}
      {showModalMotor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold dark:text-white" style={{ color: colors.primaryBlue }}>Cadastrar Nova Máquina</h3>
              <button onClick={() => setShowModalMotor(false)} className="text-gray-500 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddMotorSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nome Operacional</label>
                <input required name="nome" type="text" placeholder="Ex: Motor Compressor AC" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5C99C6]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                  <input required name="tipo" type="text" placeholder="Ex: Compressor" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">RPM Nominal</label>
                  <input required name="rpm" type="number" placeholder="Ex: 1800" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Setor / Linha</label>
                <input required name="localizacao" type="text" placeholder="Ex: Setor de Produção C" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Vincular Microcontrolador (Sensor)</label>
                <select
                  required
                  name="mcu_id"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:outline-none bg-white dark:bg-[#252525]"
                >
                  <option value="">Selecione um sensor integrado...</option>
                  {Array.isArray(microcontroladores) && microcontroladores.map(mcu => (
                    <option key={mcu.ID_MCU} value={mcu.ID_MCU}>
                      {mcu.Nome_Dispositivo} ({mcu.Modelo} - {mcu.ID_MCU})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full mt-4 p-4 bg-[#539845] hover:bg-[#468239] text-white font-bold rounded-lg transition-colors">Salvar Máquina no Banco</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADICIONAR USUÁRIO */}
      {showModalUsuario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold dark:text-white" style={{ color: colors.primaryBlue }}>Cadastrar Operador</h3>
              <button onClick={() => setShowModalUsuario(false)} className="text-gray-500 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddUsuarioSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                <input required name="nome" type="text" placeholder="Ex: Henrique Macedo" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5C99C6]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">E-mail (Login)</label>
                  <input required name="login" type="email" placeholder="nome@inertia.com" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Senha de Acesso</label>
                  <input required name="senha" type="password" placeholder="••••••••" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">WhatsApp Alertas</label>
                  <input name="telefone" type="text" placeholder="(11) 99999-0000" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Grau de Acesso (RBAC)</label>
                  <select name="acesso" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:outline-none bg-white dark:bg-[#252525]">
                    <option value="Operador">Operador</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full mt-4 p-4 bg-[#112A46] hover:bg-[#0c1e33] text-white font-bold rounded-lg transition-colors">Gravar Usuário no Banco</button>
            </form>
          </div>
        </div>
      )}

      {/* BARRA LATERAL */}
      <aside className="w-64 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300">
        <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <span className="text-2xl font-extrabold tracking-tight dark:text-white" style={{ color: !isDarkMode ? colors.primaryBlue : undefined }}>
            inert<span style={{ color: colors.primaryGreen }}>i</span>a.
          </span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-2">
          <button onClick={() => setActiveMenu('motores')} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${activeMenu === 'motores' ? 'bg-[#5C99C6] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}><Activity size={20} className="mr-3" /> Motores</button>
          <button onClick={() => setActiveMenu('perfil')} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${activeMenu === 'perfil' ? 'bg-[#5C99C6] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}><User size={20} className="mr-3" /> Perfil</button>
          <button onClick={() => setActiveMenu('usuarios')} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${activeMenu === 'usuarios' ? 'bg-[#5C99C6] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}><Users size={20} className="mr-3" /> Usuários</button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button onClick={() => handleNavigation('home', false)} className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg font-medium transition-colors"><LogOut size={20} className="mr-3" /> Sair do Sistema</button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <h1 className="text-2xl font-bold dark:text-white">
            {activeMenu === 'motores' && 'Painel de Monitoramento'}
            {activeMenu === 'perfil' && 'Configurações de Perfil'}
            {activeMenu === 'usuarios' && 'Gerenciamento de Usuários (RBAC)'}
          </h1>
          <div className="flex items-center space-x-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">{isDarkMode ? <Sun size={22} /> : <Moon size={22} />}</button>
            <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
              <span className="mr-3 font-medium text-sm hidden md:block">Engenheiro(a) Preditivo</span>
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2" style={{ borderColor: colors.primaryGreen }}><User size={20} className="text-gray-600 dark:text-gray-300" /></div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* TELA DE MOTORES */}
          {activeMenu === 'motores' && (
            <div className="flex flex-col lg:flex-row gap-6 h-full">
              <div className="w-full lg:w-1/3 xl:w-1/4 space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-[#112A46] text-white px-4 py-2 rounded-lg font-mono text-xs inline-flex items-center shadow-md"><Settings size={14} className="mr-2" /> Gateway MQTT</div>
                  <button onClick={() => setShowModalMotor(true)} className="p-2 bg-[#539845] text-white rounded-lg hover:bg-[#468239] transition-colors shadow-sm"><Plus size={18} /></button>
                </div>
                {motores.map((motor) => (
                  <button key={motor.id} onClick={() => setSelectedMotor(motor)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${selectedMotor.id === motor.id ? 'border-[#539845] bg-[#539845]/10 dark:bg-[#539845]/20 shadow-sm' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#252525] hover:border-gray-300 dark:hover:border-gray-600'}`}>
                    <span className="font-bold text-sm dark:text-gray-200">{motor.nome}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${motor.status === 'OK' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : motor.status === 'Alerta' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>{motor.status}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col transition-colors duration-300">
                <div className="flex justify-between items-start mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold dark:text-white">{selectedMotor.nome}</h2>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${selectedMotor.status === 'OK' ? 'bg-[#539845] text-white' : selectedMotor.status === 'Alerta' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}`}>Status: {selectedMotor.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">Sensor ID: {selectedMotor.id} <span className="ml-4">| Modelo: MPU6500</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className={`p-5 rounded-xl border transition-colors ${selectedMotor.status === 'Alerta' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' : selectedMotor.status === 'Sem Dados' ? 'bg-gray-100 dark:bg-gray-800 border-gray-200' : 'bg-gray-50 dark:bg-[#1e1e1e] border-gray-100 dark:border-gray-800'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Velocidade RMS</p>
                    <p className={`text-3xl font-bold ${selectedMotor.status === 'Alerta' ? 'text-red-600 dark:text-red-400' : 'dark:text-white'}`}>{selectedMotor.velocidade}</p>
                  </div>
                  <div className={`p-5 rounded-xl border transition-colors ${selectedMotor.status === 'Alerta' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' : selectedMotor.status === 'Sem Dados' ? 'bg-gray-100 dark:bg-gray-800 border-gray-200' : 'bg-gray-50 dark:bg-[#1e1e1e] border-gray-100 dark:border-gray-800'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Aceleração de Pico</p>
                    <p className={`text-3xl font-bold ${selectedMotor.status === 'Alerta' ? 'text-red-600 dark:text-red-400' : 'dark:text-white'}`}>{selectedMotor.aceleracao}</p>
                  </div>
                  <div className={`p-5 rounded-xl border transition-colors ${selectedMotor.status === 'Alerta' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' : selectedMotor.status === 'Sem Dados' ? 'bg-gray-100 dark:bg-gray-800 border-gray-200' : 'bg-gray-50 dark:bg-[#1e1e1e] border-gray-100 dark:border-gray-800'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Deslocamento P-P</p>
                    <p className={`text-3xl font-bold ${selectedMotor.status === 'Alerta' ? 'text-red-600 dark:text-red-400' : 'dark:text-white'}`}>{selectedMotor.deslocamento}</p>
                  </div>
                </div>

                <div className="flex-1 bg-gray-50 dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                      <button onClick={() => setGraficoModo('24h')} className={`px-3 py-1.5 text-xs font-medium border rounded shadow-sm transition-colors ${graficoModo === '24h' ? 'bg-[#5C99C6] border-[#5C99C6] text-white' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>24h</button>
                      <button onClick={() => setGraficoModo('realtime')} className={`px-3 py-1.5 text-xs font-medium border rounded shadow-sm transition-colors ${graficoModo === 'realtime' ? 'bg-[#5C99C6] border-[#5C99C6] text-white' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>Real-time</button>
                    </div>
                  </div>
                  <div className="flex-1 relative flex items-center justify-center opacity-80">
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 border-l border-b border-gray-300 dark:border-gray-700">
                      {[...Array(24)].map((_, i) => <div key={i} className="border-t border-r border-gray-200 dark:border-gray-800/50"></div>)}
                    </div>
                    <svg className="w-full h-full absolute inset-0 preserve-aspect-ratio-none transition-all duration-300" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <polyline points={selectedMotor.status === 'OK' && graficoModo === 'realtime' ? "0,50 10,48 20,55 30,45 40,52 50,49 60,60 70,45 80,55 90,48 100,50" : selectedMotor.status === 'OK' && graficoModo === '24h' ? "0,50 25,48 50,52 75,49 100,50" : selectedMotor.status === 'Alerta' ? "0,50 10,20 20,80 30,10 40,90 50,20 60,85 70,15 80,95 90,10 100,50" : "0,90 100,90"} fill="none" stroke={selectedMotor.status === 'OK' ? colors.primaryGreen : selectedMotor.status === 'Alerta' ? '#ef4444' : '#9ca3af'} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TELA DE PERFIL (FORMULÁRIO RETORNADO E INTEGRADO) */}
          {activeMenu === 'perfil' && (
            <div className="max-w-3xl mx-auto w-full space-y-6 animate-fadeIn">
              <div className="bg-white dark:bg-[#252525] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center"><User className="text-[#5C99C6] mr-3" /><h3 className="text-xl font-bold dark:text-white">Dados Pessoais</h3></div>
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4" style={{ borderColor: colors.primaryGreen }}><User size={40} className="text-gray-500 dark:text-gray-400" /></div>
                    <div>
                      <h4 className="text-xl font-bold dark:text-white">Engenheiro(a) Preditivo Master</h4>
                      <p className="text-gray-500 dark:text-gray-400">Acesso: Administrador (MySQL Link Ativo)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* O FORMULÁRIO QUE ESTAVA FALTANDO VOLTOU CONECTADO À ROTA PUT */}
              <form onSubmit={handleAtualizarPerfil} className="bg-white dark:bg-[#252525] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center"><Shield className="text-[#5C99C6] mr-3" /><h3 className="text-xl font-bold dark:text-white">Segurança de Acesso</h3></div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">E-mail Corporativo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail size={18} className="text-gray-400" /></div>
                      <input type="email" value={emailPerfil} onChange={(e) => setEmailPerfil(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1e1e1e] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#5C99C6]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nova Senha</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={18} className="text-gray-400" /></div>
                        <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="••••••••" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1e1e1e] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#5C99C6]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirmar Nova Senha</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={18} className="text-gray-400" /></div>
                        <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="••••••••" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1e1e1e] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#5C99C6]" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button type="submit" className="px-6 py-3 bg-[#539845] hover:bg-[#468239] text-white rounded-lg font-bold flex items-center transition-colors shadow-sm"><Save size={18} className="mr-2" /> Salvar Alterações no Banco</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TELA DE USUÁRIOS */}
          {activeMenu === 'usuarios' && (
            <div className="max-w-5xl mx-auto w-full animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">Gerenciamento de Acessos</h2>
                  <p className="text-gray-500 dark:text-gray-400">Administre o nível de acesso dos operadores no banco de dados.</p>
                </div>
                <button onClick={() => setShowModalUsuario(true)} className="px-5 py-2.5 bg-[#112A46] text-white rounded-lg font-bold flex items-center hover:bg-[#0c1e33] transition-colors shadow-md"><Plus size={18} className="mr-2" /> Cadastrar Operador</button>
              </div>

              <div className="bg-white dark:bg-[#252525] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800">
                        <th className="py-4 px-6 font-bold text-gray-700 dark:text-gray-300 text-sm">Nome / Login</th>
                        <th className="py-4 px-6 font-bold text-gray-700 dark:text-gray-300 text-sm">Nível de Acesso</th>
                        <th className="py-4 px-6 font-bold text-gray-700 dark:text-gray-300 text-sm text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((user) => (
                        <tr key={user.ID_Usuario} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-[#1e1e1e]/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold dark:text-white">{user.Nome_Exibicao}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">User: {user.Login}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.Grau_Acesso === 'Administrador' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                              user.Grau_Acesso === 'Técnico' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                              }`}>{user.Grau_Acesso}</span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button onClick={() => deletarUsuario(user.ID_Usuario, user.Nome_Exibicao)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}