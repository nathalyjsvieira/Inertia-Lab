import React, { useState, useEffect } from 'react';
import {
  Activity, User, Users, LogOut, Sun, Moon,
  Settings, Trash2, Plus, StopCircle, Mail, Lock, Shield, Edit2, Save, X
} from 'lucide-react';

export default function Dashboard({ colors, handleNavigation }) {
  // === ESTADOS DA CASCA (UI GERAL) ===
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeMenu, setActiveMenu] = useState('jobs'); // O menu principal agora é o seu!

  // === ESTADOS DO SEU PAINEL DE JOBS (Versão do Usuário) ===
  const [graficoModo, setGraficoModo] = useState('realtime');
  const [visivel, setVisivel] = useState({ comp: true, x: false, y: false, z: false });
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const defaultZeros = { comp: "0.00", x: "0.00", y: "0.00", z: "0.00" };
  const [analise, setAnalise] = useState({ velocidadeRMS: defaultZeros, aceleracaoPico: defaultZeros, deslocamentoPP: defaultZeros, grafico: [] });
  const [showModalJob, setShowModalJob] = useState(false);

  // === ESTADOS DE PERFIL E USUÁRIOS (Segunda Versão) ===
  const [usuarios, setUsuarios] = useState([]);
  const [showModalUsuario, setShowModalUsuario] = useState(false);
  const [emailPerfil, setEmailPerfil] = useState('admin@inertialabs.com');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // === CONTROLE DO MODO ESCURO ===
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    return () => document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // ==========================================
  // SUA LÓGICA: POLLING INTELIGENTE DE JOBS
  // ==========================================
  const carregarJobs = () => {
    fetch('http://localhost:3000/api/jobs')
      .then(res => res.json())
      .then(dados => setJobs(dados))
      .catch(console.error);
  };

  useEffect(() => {
    carregarJobs();
    const intLista = setInterval(carregarJobs, 2000);
    return () => clearInterval(intLista);
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      if (!selectedJob) {
        setSelectedJob(jobs[0]);
      } else {
        if (jobs[0].Status_Trabalho === 'Em Andamento' && jobs[0].ID_Job !== selectedJob.ID_Job) {
          setSelectedJob(jobs[0]);
        } else {
          const atualizado = jobs.find(j => j.ID_Job === selectedJob.ID_Job);
          if (atualizado && atualizado.Status_Trabalho !== selectedJob.Status_Trabalho) {
            setSelectedJob(atualizado);
          }
        }
      }
    }
  }, [jobs]);

  // === SUA LÓGICA: POLLING DA ANÁLISE DO GRÁFICO ===
  useEffect(() => {
    let interval;
    if (selectedJob) {
      const fetchAnalise = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/jobs/${selectedJob.ID_Job}/analise`);
          setAnalise(await res.json());
        } catch (e) { console.error(e) }
      };
      fetchAnalise();
      if (selectedJob.Status_Trabalho === 'Em Andamento') interval = setInterval(fetchAnalise, 2000);
    }
    return () => clearInterval(interval);
  }, [selectedJob]);

  // Ações de Jobs
  const handleAddJobSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const resposta = await fetch('http://localhost:3000/api/jobs', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_trabalho: formData.get('nome_trabalho'),
          descricao: formData.get('descricao'),
          resolucao: parseInt(formData.get('resolucao'))
        })
      });
      const resData = await resposta.json();
      if (resposta.ok) { setShowModalJob(false); carregarJobs(); }
      else { alert(resData.erro || "Erro de conexão."); }
    } catch (erro) { alert("Erro de conexão com o servidor."); }
  };

  const handlePararJob = async () => {
    if(!selectedJob) return;
    try { await fetch(`http://localhost:3000/api/jobs/${selectedJob.ID_Job}/parar`, { method: 'POST' }); carregarJobs(); }
    catch (err) { console.error(err) }
  };

  const handleExcluirJob = async () => {
    if(!selectedJob) return;
    if(window.confirm("Deseja excluir este Job e todos os seus dados brutos permanentemente?")) {
      await fetch(`http://localhost:3000/api/jobs/${selectedJob.ID_Job}`, { method: 'DELETE' });
      setSelectedJob(null); carregarJobs();
    }
  };

  const renderSvgPoints = (eixo) => {
    if (!analise.grafico || analise.grafico.length === 0) return "0,100 100,100";
    const dados = graficoModo === 'realtime' ? analise.grafico.slice(-50) : analise.grafico;
    return dados.map((p, i) => {
      const x = (i / Math.max(dados.length - 1, 1)) * 100;
      const maxEscala = 4.0;
      let y = 100 - ((p[eixo] / maxEscala) * 100);
      y = Math.max(0, Math.min(100, y));
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  // ==========================================
  // LÓGICA DA SEGUNDA VERSÃO: USUÁRIOS E PERFIL
  // ==========================================
  const carregarUsuarios = () => {
    fetch('http://localhost:3000/api/usuarios')
      .then(res => { if (!res.ok) throw new Error('Erro'); return res.json(); })
      .then(dados => { if (Array.isArray(dados)) setUsuarios(dados); })
      .catch(() => { setUsuarios([{ ID_Usuario: 1, Nome_Exibicao: 'Engenheiro Master', Login: 'admin@inertialabs.com', Grau_Acesso: 'Administrador' }]); });
  };

  useEffect(() => { if (activeMenu === 'usuarios') carregarUsuarios(); }, [activeMenu]);

  const handleAddUsuarioSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const novoUsuario = {
      nome: formData.get('nome'), login: formData.get('login'), senha: formData.get('senha'),
      telefone: formData.get('telefone'), acesso: formData.get('acesso')
    };
    try {
      const resposta = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(novoUsuario)
      });
      if (resposta.ok) { alert("Novo operador salvo!"); carregarUsuarios(); }
    } catch (erro) { alert("Erro de conexão."); }
    setShowModalUsuario(false);
  };

  const deletarUsuario = async (id, nome) => {
    if (window.confirm(`Remover permanentemente o usuário ${nome}?`)) {
      try {
        const resposta = await fetch(`http://localhost:3000/api/usuarios/${id}`, { method: 'DELETE' });
        if (resposta.ok) { alert("Usuário deletado!"); carregarUsuarios(); }
      } catch (error) { alert("Erro ao conectar."); }
    }
  };

  const handleAtualizarPerfil = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) { alert("As senhas não coincidem!"); return; }
    try {
      const resposta = await fetch('http://localhost:3000/api/usuarios/perfil', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: emailPerfil, novaSenha: novaSenha })
      });
      if (resposta.ok) { alert("Credenciais atualizadas!"); setNovaSenha(''); setConfirmarSenha(''); }
      else { alert("Erro ao atualizar dados."); }
    } catch (erro) { alert("Erro de conexão."); }
  };

  // ==========================================
  // RENDERIZAÇÃO DA UI
  // ==========================================
  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900 dark:bg-[#121212] dark:text-gray-100 font-sans transition-colors duration-300 relative">

      {/* SEU MODAL DE JOB */}
      {showModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold dark:text-white" style={{ color: colors.primaryBlue }}>Nova Coleta MQTT</h3>
              <button onClick={() => setShowModalJob(false)} className="text-gray-500 hover:text-red-500"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddJobSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Título do Job</label><input required name="nome_trabalho" type="text" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white" /></div>
              <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Descrição</label><input name="descricao" type="text" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white" /></div>
              <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Resolução (Hz)</label><input required name="resolucao" type="number" defaultValue="100" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white" /></div>
              <button type="submit" className="w-full mt-4 p-4 bg-[#539845] hover:bg-[#468239] text-white font-bold rounded-lg">Iniciar Captura</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE USUÁRIO (Segunda Versão) */}
      {showModalUsuario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold dark:text-white" style={{ color: colors.primaryBlue }}>Cadastrar Operador</h3>
              <button onClick={() => setShowModalUsuario(false)} className="text-gray-500 hover:text-red-500"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddUsuarioSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label><input required name="nome" type="text" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">E-mail (Login)</label><input required name="login" type="email" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white" /></div>
                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Senha</label><input required name="senha" type="password" placeholder="••••••••" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">WhatsApp</label><input name="telefone" type="text" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white" /></div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Acesso</label>
                  <select name="acesso" className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white bg-white">
                    <option value="Operador">Operador</option><option value="Técnico">Técnico</option><option value="Administrador">Administrador</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full mt-4 p-4 bg-[#112A46] hover:bg-[#0c1e33] text-white font-bold rounded-lg">Gravar Usuário no Banco</button>
            </form>
          </div>
        </div>
      )}

      {/* SIDEBAR COM A LOGO (Segunda Versão) */}
      <aside className="w-64 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300">
        <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <span className="text-2xl font-extrabold tracking-tight dark:text-white" style={{ color: !isDarkMode ? colors.primaryBlue : undefined }}>
            inert<span style={{ color: colors.primaryGreen }}>i</span>a.
          </span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-2">
          <button onClick={() => setActiveMenu('jobs')} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${activeMenu === 'jobs' ? 'bg-[#5C99C6] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}><Activity size={20} className="mr-3" /> Coletas e Gráficos</button>
          <button onClick={() => setActiveMenu('perfil')} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${activeMenu === 'perfil' ? 'bg-[#5C99C6] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}><User size={20} className="mr-3" /> Meu Perfil</button>
          <button onClick={() => setActiveMenu('usuarios')} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${activeMenu === 'usuarios' ? 'bg-[#5C99C6] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}><Users size={20} className="mr-3" /> Equipe e Acessos</button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button onClick={() => handleNavigation('home', false)} className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg font-medium transition-colors"><LogOut size={20} className="mr-3" /> Sair do Sistema</button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL + NAVBAR */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <h1 className="text-2xl font-bold dark:text-white">
            {activeMenu === 'jobs' && 'Análise de Frequência e Telemetria'}
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

          {/* ==================================================== */}
          {/* TELA 1: JOBS E GRÁFICOS (A SUA VERSÃO)               */}
          {/* ==================================================== */}
          {activeMenu === 'jobs' && (
            <div className="flex flex-col lg:flex-row gap-6 h-full">
              {jobs.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center h-64 text-gray-500 font-mono space-y-4">
                  <span>Aguardando Coletas...</span>
                  <button onClick={() => setShowModalJob(true)} className="px-6 py-3 bg-[#539845] text-white rounded-lg hover:bg-[#468239] transition-colors shadow-sm font-sans font-bold flex items-center"><Plus size={18} className="mr-2" /> Iniciar Primeira Coleta</button>
                </div>
              ) : (
                selectedJob && (
                  <>
                    <div className="w-full lg:w-1/3 xl:w-1/4 space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-[#112A46] text-white px-4 py-2 rounded-lg font-mono text-xs inline-flex items-center shadow-md"><Settings size={14} className="mr-2" /> Gateway MQTT</div>
                        <button onClick={() => setShowModalJob(true)} className="p-2 bg-[#539845] text-white rounded-lg hover:bg-[#468239] transition-colors shadow-sm"><Plus size={18} /></button>
                      </div>
                      {jobs.map((job) => (
                        <button key={job.ID_Job} onClick={() => setSelectedJob(job)} className={`w-full flex flex-col p-4 rounded-xl border transition-all text-left ${selectedJob.ID_Job === job.ID_Job ? 'border-[#5C99C6] bg-[#5C99C6]/10 dark:bg-[#5C99C6]/20' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#252525]'}`}>
                          <div className="flex justify-between items-center w-full mb-1">
                            <span className="font-bold text-sm dark:text-gray-200">{job.Nome_Trabalho}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${job.Status_Trabalho === 'Concluído' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{job.Status_Trabalho}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col">
                      <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div>
                          <h2 className="text-2xl font-bold dark:text-white mb-1">{selectedJob.Nome_Trabalho}</h2>
                          <p className="text-xs text-gray-400 font-mono">Job ID: {selectedJob.ID_Job}</p>
                        </div>
                        <div className="flex space-x-2">
                          {selectedJob.Status_Trabalho === 'Em Andamento' && (
                            <button onClick={handlePararJob} className="flex items-center px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg font-bold"><StopCircle size={18} className="mr-2" /> Parar Manual</button>
                          )}
                          <button onClick={handleExcluirJob} className="p-2 bg-gray-500/10 text-gray-500 rounded-lg hover:bg-red-500/10 hover:text-red-500"><Trash2 size={18} /></button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="p-5 rounded-xl border bg-gray-50 dark:bg-[#1e1e1e] border-gray-100 dark:border-gray-800">
                          <p className="text-sm text-gray-500 font-medium mb-1">Velocidade RMS</p>
                          <p className="text-3xl font-bold dark:text-white">{visivel.comp ? analise.velocidadeRMS.comp : '--'} <span className="text-lg text-gray-400">mm/s</span></p>
                          <div className="flex gap-3 mt-3 font-mono text-xs font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                            {visivel.x && <span className="text-red-500">X: {analise.velocidadeRMS.x}</span>}
                            {visivel.y && <span className="text-blue-500">Y: {analise.velocidadeRMS.y}</span>}
                            {visivel.z && <span className="text-yellow-500">Z: {analise.velocidadeRMS.z}</span>}
                          </div>
                        </div>

                        <div className="p-5 rounded-xl border bg-gray-50 dark:bg-[#1e1e1e] border-gray-100 dark:border-gray-800">
                          <p className="text-sm text-gray-500 font-medium mb-1">Aceleração de Pico</p>
                          <p className="text-3xl font-bold dark:text-white">{visivel.comp ? analise.aceleracaoPico.comp : '--'} <span className="text-lg text-gray-400">G</span></p>
                          <div className="flex gap-3 mt-3 font-mono text-xs font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                            {visivel.x && <span className="text-red-500">X: {analise.aceleracaoPico.x}</span>}
                            {visivel.y && <span className="text-blue-500">Y: {analise.aceleracaoPico.y}</span>}
                            {visivel.z && <span className="text-yellow-500">Z: {analise.aceleracaoPico.z}</span>}
                          </div>
                        </div>

                        <div className="p-5 rounded-xl border bg-gray-50 dark:bg-[#1e1e1e] border-gray-100 dark:border-gray-800">
                          <p className="text-sm text-gray-500 font-medium mb-1">Deslocamento P-P</p>
                          <p className="text-3xl font-bold dark:text-white">{visivel.comp ? analise.deslocamentoPP.comp : '--'} <span className="text-lg text-gray-400">µm</span></p>
                          <div className="flex gap-3 mt-3 font-mono text-xs font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                            {visivel.x && <span className="text-red-500">X: {analise.deslocamentoPP.x}</span>}
                            {visivel.y && <span className="text-blue-500">Y: {analise.deslocamentoPP.y}</span>}
                            {visivel.z && <span className="text-yellow-500">Z: {analise.deslocamentoPP.z}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 bg-gray-50 dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                          <div className="flex flex-wrap gap-4 bg-white dark:bg-[#252525] p-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <label className="flex items-center space-x-2 text-sm font-bold cursor-pointer" style={{color: colors.primaryGreen}}>
                              <input type="checkbox" checked={visivel.comp} onChange={(e) => setVisivel({...visivel, comp: e.target.checked})} className="accent-[#539845]" /><span>Resultante</span>
                            </label>
                            <label className="flex items-center space-x-2 text-sm text-red-500 font-bold cursor-pointer">
                              <input type="checkbox" checked={visivel.x} onChange={(e) => setVisivel({...visivel, x: e.target.checked})} className="accent-red-500" /><span>Eixo X</span>
                            </label>
                            <label className="flex items-center space-x-2 text-sm text-blue-500 font-bold cursor-pointer">
                              <input type="checkbox" checked={visivel.y} onChange={(e) => setVisivel({...visivel, y: e.target.checked})} className="accent-blue-500" /><span>Eixo Y</span>
                            </label>
                            <label className="flex items-center space-x-2 text-sm text-yellow-500 font-bold cursor-pointer">
                              <input type="checkbox" checked={visivel.z} onChange={(e) => setVisivel({...visivel, z: e.target.checked})} className="accent-yellow-500" /><span>Eixo Z</span>
                            </label>
                          </div>

                          <div className="flex space-x-2 mt-4 md:mt-0">
                            <button onClick={() => setGraficoModo('realtime')} className={`px-3 py-2 text-xs font-bold border rounded shadow-sm ${graficoModo === 'realtime' ? 'bg-[#112A46] border-[#112A46] text-white' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>Tempo Real</button>
                            <button onClick={() => setGraficoModo('hist')} className={`px-3 py-2 text-xs font-bold border rounded shadow-sm ${graficoModo === 'hist' ? 'bg-[#112A46] border-[#112A46] text-white' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>Visualizar Tudo</button>
                          </div>
                        </div>

                        <div className="flex-1 relative flex items-center justify-center">
                          <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 border-l border-b border-gray-300 dark:border-gray-700">
                            {[...Array(24)].map((_, i) => <div key={i} className="border-t border-r border-gray-200 dark:border-gray-800/50"></div>)}
                          </div>
                          <svg className="w-full h-full absolute inset-0 preserve-aspect-ratio-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {visivel.x && <polyline points={renderSvgPoints('x')} fill="none" stroke="#ef4444" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />}
                            {visivel.y && <polyline points={renderSvgPoints('y')} fill="none" stroke="#3b82f6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />}
                            {visivel.z && <polyline points={renderSvgPoints('z')} fill="none" stroke="#eab308" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />}
                            {visivel.comp && <polyline points={renderSvgPoints('comp')} fill="none" stroke={colors.primaryGreen} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />}
                          </svg>
                        </div>
                      </div>
                    </div>
                  </>
                )
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TELA 2: PERFIL DE SEGURANÇA (Segunda Versão)         */}
          {/* ==================================================== */}
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

          {/* ==================================================== */}
          {/* TELA 3: USUÁRIOS (Segunda Versão)                    */}
          {/* ==================================================== */}
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
                      {Array.isArray(usuarios) && usuarios.map((user) => (
                        <tr key={user.ID_Usuario} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-[#1e1e1e]/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold dark:text-white">{user.Nome_Exibicao}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">User: {user.Login}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.Grau_Acesso === 'Administrador' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
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