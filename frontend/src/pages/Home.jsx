import React from 'react';
import {
  Activity, RefreshCw, GraduationCap, ArrowRight,
  Waves, Volume2, Cpu, Brain, BarChart, Settings, Leaf, User
} from 'lucide-react';

export default function Home({ colors, handleNavigation }) {
  return (
    <div className="animate-fadeIn">
      {/* HERO SECTION */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 relative overflow-hidden" style={{ backgroundColor: colors.primaryBlue }}>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 opacity-10">
          <Activity size={400} color={colors.primaryGreen} />
        </div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 opacity-10">
          <RefreshCw size={300} color={colors.secBlue} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6 border border-white/20">
              <GraduationCap size={16} className="mr-2" color={colors.primaryGreen} />
              Engenharia da Computação - 5º Sem.
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              A engenharia do <span style={{ color: colors.primaryGreen }}>movimento</span> preventivo.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
              Aplicamos o rigor científico e acadêmico para resolver desafios reais da indústria. Nossa missão é prever falhas em sistemas mecânicos através de processamento de sinais, Machine Learning e automação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => handleNavigation('#projeto')}
                className="px-8 py-3 rounded-full text-white font-bold text-lg flex items-center justify-center transition-transform hover:scale-105"
                style={{ backgroundColor: colors.primaryGreen }}
              >
                Ver Nosso Projeto <ArrowRight className="ml-2" size={20} />
              </button>
              <button
                onClick={() => handleNavigation('login', false)}
                className="px-8 py-3 rounded-full font-bold text-lg border-2 flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ borderColor: colors.secBlue, color: 'white' }}
              >
                Acessar Sistema
              </button>
            </div>
          </div>

          <div className="md:w-1/2 mt-16 md:mt-0 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 border-8 rounded-full border-t-transparent border-l-transparent animate-spin-slow" style={{ borderColor: colors.primaryGreen, animationDuration: '8s' }}></div>
              <div className="absolute inset-4 border-8 rounded-full border-b-transparent border-r-transparent animate-reverse-spin" style={{ borderColor: colors.secBlue, animationDuration: '12s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-full shadow-2xl border border-white/10">
                <Activity size={80} color={colors.primaryGreen} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUEM SOMOS / ACADÊMICO */}
      <section id="sobre" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: colors.secBlue }}>Origem Acadêmica & Visão Industrial</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: colors.primaryBlue }}>
            Engenharia Aplicada e Rigor Científico
          </h3>
          <p className="max-w-4xl mx-auto text-xl leading-relaxed text-gray-600 mb-6">
            A <strong style={{ color: colors.primaryBlue }}>Inertia Labs</strong> é um laboratório de inovações fundado por estudantes do <strong style={{ color: colors.primaryBlue }}>5º semestre de Engenharia da Computação (2026)</strong>. Nascemos dentro da faculdade com o propósito de tirar a engenharia do papel e aplicá-la diretamente na resolução de problemas da indústria real.
          </p>
          <p className="max-w-4xl mx-auto text-lg leading-relaxed text-gray-600">
            Nossa abordagem é estritamente técnica: utilizamos modelagem matemática, processamento digital de sinais, <strong style={{ color: colors.primaryBlue }}>Machine Learning</strong> e integração hardware-software para criar sistemas que preveem falhas, otimizam recursos mecânicos e evitam o desperdício, garantindo a verdadeira <strong style={{ color: colors.primaryGreen }}>sustentabilidade</strong> dos processos industriais.
          </p>
        </div>
      </section>

      {/* O PROJETO: ANÁLISE DE RUÍDO DE MOTORES */}
      <section id="projeto" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-xl mb-6">
                <Waves size={32} style={{ color: colors.secBlue }} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.primaryBlue }}>
                Case de Engenharia: <span style={{ color: colors.primaryGreen }}>Análise Acústica Preditiva</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Nosso primeiro grande projeto prático ataca um dos maiores gargalos da manufatura: a quebra inesperada de motores elétricos e de combustão.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Desenvolvemos uma solução embarcada capaz de realizar a <strong>análise de ruído de motores em geral</strong>. Por meio do processamento avançado do espectro sonoro aliado a modelos de <strong>Machine Learning</strong>, nosso sistema identifica padrões complexos de anomalias de áudio, falhas em rolamentos e desgastes estruturais <em>antes</em> que a peça quebre, permitindo ações preventivas precisas e minimizando a inércia destrutiva.
              </p>

              <ul className="space-y-4">
                {[
                  { icon: <Volume2 size={20} />, text: 'Captação robusta de sinais acústicos e vibração em tempo real.' },
                  { icon: <Cpu size={20} />, text: 'Processamento Digital de Sinais (Transformada de Fourier) no edge.' },
                  { icon: <Brain size={20} />, text: 'Modelos de Machine Learning para classificação preditiva de falhas.' },
                  { icon: <BarChart size={20} />, text: 'Mapeamento de padrões de desgaste e emissão de alertas inteligentes.' }
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700 font-medium">
                    <span className="mr-3 p-2 rounded-full flex-shrink-0" style={{ backgroundColor: `${colors.primaryGreen}20`, color: colors.primaryGreen }}>
                      {item.icon}
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleNavigation('links', false)}
                className="mt-8 flex items-center font-bold text-lg hover:underline transition-all"
                style={{ color: colors.secBlue }}
              >
                Acessar Repositórios e Documentação <ArrowRight className="ml-2" size={18} />
              </button>
            </div>

            <div className="lg:w-1/2 mt-10 lg:mt-0 relative w-full">
              <div className="absolute inset-0 rounded-3xl transform rotate-3 opacity-10" style={{ backgroundImage: `linear-gradient(to right, ${colors.primaryBlue}, ${colors.secBlue})` }}></div>
              <div className="bg-white border border-gray-100 rounded-3xl shadow-xl p-8 relative z-10 w-full">
                <h4 className="text-xl font-bold mb-6 text-center" style={{ color: colors.primaryBlue }}>Monitoramento do Espectro Sonoro</h4>

                <div className="h-48 flex items-end justify-between space-x-1 mb-6 opacity-80">
                  {[...Array(24)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full rounded-t-sm"
                      style={{
                        height: `${Math.random() * (i === 15 || i === 16 ? 90 : 35) + 15}%`,
                        backgroundColor: i === 15 || i === 16 ? '#ef4444' : colors.primaryGreen,
                        transition: 'height 0.5s ease'
                      }}
                    ></div>
                  ))}
                </div>

                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2 bg-red-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-700">Frequência de Falha (Rolamento)</span>
                  </div>
                  <span className="text-sm font-mono text-gray-500">2.4 kHz detectado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section id="pilares" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: colors.primaryBlue }}>
              Nossos Pilares de Atuação
            </h2>
            <div className="w-24 h-1 mt-6 mx-auto rounded-full" style={{ backgroundColor: colors.primaryGreen }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Engenharia', icon: <Settings size={40} />, desc: 'Aplicação rigorosa de cálculo e física para resolver problemas mecânicos complexos.', color: colors.primaryBlue },
              { title: 'Tecnologia', icon: <Cpu size={40} />, desc: 'Desenvolvimento embarcado, Machine Learning e algoritmos de processamento de dados.', color: colors.secBlue },
              { title: 'Automação', icon: <Activity size={40} />, desc: 'Sistemas inteligentes de monitoramento contínuo, reduzindo a intervenção humana.', color: colors.primaryBlue },
              { title: 'Sustentabilidade', icon: <Leaf size={40} />, desc: 'Extensão da vida útil de equipamentos industriais e redução contínua do desperdício.', color: colors.primaryGreen },
            ].map((pillar, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-opacity-10 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${pillar.color}20`, color: pillar.color }}
                >
                  {pillar.icon}
                </div>
                <h4 className="text-xl font-bold mb-3" style={{ color: colors.primaryBlue }}>{pillar.title}</h4>
                <p className="text-gray-600">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === NOVA SEÇÃO: A EQUIPE === */}
      <section id="equipe" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: colors.primaryBlue }}>
              A Equipe <span style={{ color: colors.primaryGreen }}>Inertia</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça os estudantes de engenharia responsáveis pelo desenvolvimento do sistema de análise preditiva.
            </p>
            <div className="w-24 h-1 mt-6 mx-auto rounded-full" style={{ backgroundColor: colors.primaryGreen }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                nome: 'Gustavo Germiniani',
                papel: 'Engenheiro de Hardware / IoT',
                desc: 'Responsável pela prototipagem do sistema de captação acústica e integração dos sensores de vibração no edge.'
              },
              {
                nome: 'Henrique Macedo',
                papel: 'Engenheiro de dados',
                desc: 'Responsável pela modelagem do banco de dados e construção dos pipelines de extração e tratamento dos dados gerados pelos sensores.'
              },
              {
                nome: 'Henrique Prado',
                papel: 'Especialista em gestão de projetos e documentação',
                desc: 'Responsável pelo acompanhamento das entregas do projeto, gestão de riscos, documentação arquitetural e manuais de uso."'
              },
              {
                nome: 'João Henrique',
                papel: 'Especialista em Machine Learning',
                desc: 'Desenvolvimento dos modelos preditivos e treinamento das redes neurais para detecção de anomalias.'
              },
              {
                nome: 'Nathaly Vieira',
                papel: 'Engenheiro de Software',
                desc: 'Criação da arquitetura do sistema, processamento digital de sinais (FFT) e desenvolvimento da interface.'
              }
            ].map((membro, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center group hover:-translate-y-1"
              >
                <div
                  className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-200 group-hover:scale-105 transition-transform"
                  style={{ color: colors.secBlue }}
                >
                  {/* Substitua o ícone abaixo pela tag <img /> quando tiver as fotos reais */}
                  <User size={40} />
                </div>
                <h4 className="text-xl font-bold mb-1" style={{ color: colors.primaryBlue }}>{membro.nome}</h4>
                <p className="font-medium text-sm mb-4" style={{ color: colors.primaryGreen }}>{membro.papel}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{membro.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILOSOFIA */}
      <section id="filosofia" className="py-20 text-white" style={{ backgroundColor: colors.primaryBlue }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Deconstrução Visual & Metodologia</h2>
              <p className="text-gray-300 text-lg mb-8">
                Nossa identidade visual não é apenas estética; é o mapa da nossa metodologia de trabalho. O símbolo do infinito reflete nosso compromisso com o ciclo de vida completo da tecnologia.
              </p>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/20">
                <RefreshCw size={32} className="mb-4" style={{ color: colors.secBlue }} />
                <h4 className="text-xl font-bold mb-2 text-white">Seta Circular</h4>
                <p className="text-sm text-gray-300">Representa processos contínuos, renovação, engenharia de ciclos e o intenso dinamismo da nossa equipe.</p>
              </div>

              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/20">
                <Activity size={32} className="mb-4 text-white" />
                <h4 className="text-xl font-bold mb-2 text-white">Trilhas & Pulso</h4>
                <p className="text-sm text-gray-300">Os circuitos e o gráfico de batimento simbolizam a Tecnologia conectando dados, sinais e energia inteligente.</p>
              </div>

              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/20" style={{ borderColor: `${colors.primaryGreen}50` }}>
                <Leaf size={32} className="mb-4" style={{ color: colors.primaryGreen }} />
                <h4 className="text-xl font-bold mb-2 text-white">A Folha</h4>
                <p className="text-sm text-gray-300">Culminando no nosso processo, representa a Sustentabilidade e nosso compromisso ecológico irrevogável.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: colors.primaryBlue }}>
              Apoiando a <span style={{ color: colors.primaryGreen }}>Engenharia</span> Universitária
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Seja você um professor, pesquisador, ou parceiro industrial interessado no nosso projeto de análise preditiva de motores. Entre em contato com nossa equipe acadêmica!
            </p>

            <form
              className="max-w-md mx-auto space-y-4 text-left"
              onSubmit={async (e) => {
                e.preventDefault();
                const nome = e.target[0].value;
                const email = e.target[1].value;

                try {
                  // Faz a ponte real com o backend!
                  const resposta = await fetch('http://localhost:3000/api/contato', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email })
                  });

                  if (resposta.ok) {
                    alert("Mensagem enviada com sucesso! Nossa equipe entrará em contato.");
                    e.target.reset(); // Limpa os campos
                  } else {
                    alert("Erro ao enviar mensagem. Verifique a conexão com o servidor.");
                  }
                } catch (erro) {
                  console.error("Erro na requisição:", erro);
                  alert("Servidor offline no momento.");
                }
              }}
            >
              <div>
                <input required type="text" placeholder="Seu Nome" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#539845]" />
              </div>
              <div>
                <input required type="email" placeholder="Seu E-mail Corporativo" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#539845]" />
              </div>
              <button type="submit" className="w-full py-4 rounded-lg text-white font-bold text-lg transition-transform hover:scale-[1.02] shadow-lg" style={{ backgroundColor: colors.primaryBlue }}>
                Solicitar Contato
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}